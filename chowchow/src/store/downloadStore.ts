import * as MPPlayer from 'react-native-mediapeers'
import { observable, action, IObservableArray, } from 'mobx'
import { get, includes, reduce, map, pull, find, filter, compact, flatten, throttle } from 'lodash'
import DeviceInfo from "react-native-device-info"
import { syncMetadata, clearMetadata, dropMetadataByVideoId } from 'chowchow/src/lib/sync'
import { ProductStorage, AssetStorage } from 'chowchow/src/lib/Storage'
import { getVideoUrl } from 'chowchow/src/lib/assetApi'
import { IFullProduct, IAsset } from 'chowchow/src/lib/interfaces'
import Store, { updateAssets, resetAssets } from './index'

import {
  alertDownloadError,
  alertNoNetworkConnection,
  alertDownloadOnCellularDisabled,
  confirmResumeIncompleteDownloads
} from 'chowchow/src/manager/alert'

export default class DownloadStore {

    @observable public products = [] as IObservableArray<IFullProduct>
    @observable public assets = [] as IObservableArray<IAsset>
    @observable public downloadOnlyOnWifi = true
    @observable public freeSpace = 0

    public constructor() {
      MPPlayer.onDownloadStateChange((s) => console.log(s))
      MPPlayer.onDownloadProgress((p) => this.handleProgress(p))
      MPPlayer.onReloadVideoList(() => this.onReloadVideoList())
      MPPlayer.onDownloadPlaylistError(e => this.onDownloadError(e))

      this.init()

      this.sync()
    }

    public async init(): Promise<void> {
      this.downloadOnlyOnWifi = await MPPlayer.getDownloadsVideosViaWifiOnly()
      await this.load()
    }

    public async load(): Promise<void> {
      const previousAssetIds = map(this.assets, `id`)

      const products = await ProductStorage.list()
      const assets = await AssetStorage.list()

      const removedAssetIds = reduce(assets, (arr, asset) => {
        return pull(arr, asset.id) // remove asset id if asset is still in storage
      }, previousAssetIds)

      this.products.replace(products)
      this.assets.replace(assets)
      updateAssets(assets)
      resetAssets(removedAssetIds)

      this.setFreeSpace()
    }

    @action.bound
    public async start(productId: number, assetId: number): Promise<void> {
      if (!Store.network.connected) {
        alertNoNetworkConnection()
        return
      }

      if (this.downloadOnlyOnWifi && !Store.network.onWifi) {
        alertDownloadOnCellularDisabled()
        return
      }

      const playlistURL = await getVideoUrl(assetId)
      const item = MPPlayer.makeItem({
        assetId,
        playlistURL
      }, `inQueue`)

      await syncMetadata(productId, assetId, { item })
      await MPPlayer.downloadVideo(item)
    }

    @action.bound
    public async remove(assetId: number): Promise<void> {
      try {
        await dropMetadataByVideoId(assetId)
        await MPPlayer.removeVideo(assetId)
      } catch (error) {
        console.log(error)
      } finally {
        await this.load()
      }

    }

    @action.bound
    public async removeAll(): Promise<any> {
      await clearMetadata()
      await MPPlayer.removeAllVideos()

      this.assets.clear()
      this.products.clear()
    }

    @action.bound
    public async removeByProductId(productId): Promise<any> {
      try {
        const assets = this.getAllRelatedAssetsForProductId(productId)
        const promises = assets.map(a => this.remove(a.id))

        const res = await Promise.all(promises)
        // const res = await this.deleteFromDisk(assetIds)

        // await dropMetadataByProductId(productId)

      } catch (error) {
        console.log(error)
      } finally {
        await this.load()
      }

    }

    public async resumeAll() {
      await MPPlayer.resumeDownloads()
    }

    public async pauseAll() {
      await MPPlayer.pauseDownloads()
    }

    public async stopAll() {
      await MPPlayer.stopDownloads()
    }

    private onReloadVideoList(): void {
      this.init()
    }

    private onDownloadError(e?) {
      const message = (e && e.error) ? e.error : null

      alertDownloadError(message)
    }

    private async handleProgress(videoItem: MPPlayer.IMPPlayerItem) {
      if (!videoItem || !videoItem.progress) {
        return
      }

      console.log('progress update', videoItem)
      await AssetStorage.update({ item: videoItem }, videoItem.assetId)

      if (videoItem.progress.progress === `error`) {
        console.error(videoItem)

        this.onDownloadError()

      }

      if (videoItem.progress.progress === `complete`) {
        console.log(`complete`)
      }

      this.load()

      this.setFreeSpace()
    }

    public async setDownloadsVideosViaWifiOnly(value) {
      this.downloadOnlyOnWifi = value
      await MPPlayer.setDownloadsVideosViaWifiOnly(value)
    }

    public getTotalSize(assets: any[] = this.assets) {
      return assets.reduce((accumulator, asset) => {

        const size = get(asset, `item.size`, 0)

        return accumulator + size
      },0)
    }

    public getTotalSizeByAssetIds(ids = this.assets){
      return ids.reduce((accumulator, id) => {
        const asset = find(this.assets, { id })
        const size = get(asset, `item.size`, 0)

        return accumulator + size
      },0)
    }

    public getDownloadState(ids: any[] = this.assets): MPPlayer.IMPDownloadProgress{

      const state = {}

      ids.forEach((asset, id) => {
        const progress = get(asset, `item.progress.progress`)

        if (!state[progress]) state[progress] = 0

        state[progress] += 1
      })

      return state
    }

    public getAllRelatedProductsForProductId(productId): any[]{
      const rootProduct = find(this.products, { id: productId })
      const childProducts = filter(this.products, { parent_id: productId })
      const allRelatedProducts = compact([rootProduct].concat(childProducts))

      return allRelatedProducts
    }

    public getAllRelatedAssetsForProductId(productId): any[]{
      const allRelatedProducts = this.getAllRelatedProductsForProductId(productId)
      const flatProducts = flatten(allRelatedProducts)
      const assetsForProducts = map(flatProducts, (p) => filter(this.assets, { product_id: p.id }))
      const flatAssets = flatten(assetsForProducts)

      return flatAssets
    }

    public resumeIncomplete() {

      const pending = this.assets.filter((asset) => {

        const value = get(asset, `item.progress.progressValue`)
        const state = get(asset, `item.progress.progress`)

        return (value < 1 && !includes([`error`,`terminated`], state))
      })

      if (!pending.length) return

      confirmResumeIncompleteDownloads(pending.length, () => {
        pending.forEach(asset => {
          this.start(asset.product_id, asset.id)
        })
      }, () => {
        pending.forEach(asset => {
          this.remove(asset.id)
        })
      })
    }

    // this should not be needed..
    public async sync() {
      // let missingData = []
      // let missingFile = []

      const videoDataOnDisk = await AssetStorage.getAll()
      const videosOnDisk = await MPPlayer.getDownloadedVideos()

      console.log(`videoDataOnDisk`,videoDataOnDisk)
      console.log(`videosOnDisk`,videosOnDisk)

      // videoDataOnDisk.forEach(v => console.log(`videoDataOnDisk`,v.id, v.item.progress))
      // videosOnDisk.forEach(v => console.log(`videosOnDisk`,v.assetId, v.progress))

      // videosOnDisk.forEach((video: IMPPlayerItem) => {
      //   const id = video.assetId

      //   const exists = videoDataOnDisk.find((data: IAsset) => {
      //     return (data.id === id)
      //   })

      //   if (!exists) missingData.push(id)
      // })

      // videoDataOnDisk.forEach((video: IProductAsset) => {
      //   const id = video.id

      //   const exists = videosOnDisk.find((data: IMPPlayerItem) => {
      //     return (data.assetId === id)
      //   })

      //   if (!exists) missingFile.push(id)
      // })

      // console.log(`missingData`,missingData)
      // console.log(`missingFile`,missingFile)

      // missingData.forEach((id) => dropMetadataByVideoId(id))
      // missingFile.forEach((id) => MPPlayer.removeVideo(id))
    }

    private setFreeSpace() {

      throttle(async () => {
        this.freeSpace = await DeviceInfo.getFreeDiskStorage()
      }, 2000)()

    }

}
