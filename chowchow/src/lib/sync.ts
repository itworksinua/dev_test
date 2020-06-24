import * as MPPlayer from 'react-native-mediapeers'
import { merge, get, uniq, concat, without, isEmpty, toLower, map, toInteger, each} from 'lodash'
import {noCommonElements} from './helpers/noCommonElements'
import { AssetStorage, ProductStorage, GroupStorage } from 'chowchow/src/lib/Storage'
import { getProductAndAncestors } from 'chowchow/src/lib/productApi'
import { getVideo, getVideoUrl, getMarketingAssets } from 'chowchow/src/lib/assetApi'
import { getGroup, getProductsOfGroup, getAssetsOfGroup } from 'chowchow/src/lib/groupsApi'
import { IFullProduct, IAsset } from 'chowchow/src/lib/interfaces'
import AsyncStorage from '@react-native-community/async-storage'

export const syncMetadata = async (product_id: number, video_id?: number, assetData: Partial<IAsset> = {}): Promise<{ product: IFullProduct; asset: IAsset }> => {
  // TODO: try to parallize again!
  const asset = await syncAssets(product_id, video_id, assetData)
  const product = await syncProducts(product_id, video_id)

  await Promise.all([
    AssetStorage.persist(),
    ProductStorage.persist(),
  ])

  return {
    product,
    asset,
  }
}

export const syncAssets = async (product_id: number, video_id: number, assetData: Partial<IAsset> = {}, group_id?: number) => {
  const video = await getVideo(video_id)

  merge(video, assetData)

  let record, ids, explicitIds, implicitIds, groupIds

  // if asset exists already, add references to this product tree's ids
  record = await AssetStorage.find(video_id)

  if (group_id && get(record, 'updated_at') === get(video, 'updated_at')) // same object do not update
    return video

  ids = get(record, `product_ids`, [])
  groupIds = get(record, `group_ids`, [])
  product_id ? video.product_id = product_id : video.product_id = record.video_id
  video.product_ids = uniq(concat(ids, product_id))
  video.group_ids = uniq(concat(groupIds, group_id))

  await AssetStorage.save(video)

  return video
}

export const syncProducts = async (product_id: number, video_id?: number) => {
  const productAndAncestors = await getProductAndAncestors(product_id)
  const { product, ancestors } = productAndAncestors

  let record, ids, explicitIds, implicitIds

  // if product exists already, add references to this asset
  record = await ProductStorage.find(product.id)
  explicitIds = get(record, `video_ids`, [])
  product.video_ids = video_id ? uniq(concat(explicitIds, video_id)) : explicitIds
  implicitIds = get(record, `implicit_video_ids`, [])
  product.implicit_video_ids = video_id ? uniq(concat(implicitIds, video_id)) : implicitIds
  product.ancestor_ids = !isEmpty(product.ancestry) ? map(product.ancestry.split(`/`), toInteger) : []
  product.stringified = toLower(JSON.stringify(product)) // for search
  await ProductStorage.save(product)

  for (let i in ancestors) {
    const ancestor = ancestors[i]

    record = await ProductStorage.find(ancestor.id)
    implicitIds = get(record, `implicit_video_ids`, [])
    ancestor.implicit_video_ids = video_id ? uniq(concat(implicitIds, video_id)) : implicitIds
    ancestor.ancestor_ids = !isEmpty(ancestor.ancestry) ? ancestor.ancestry.split(`/`) : []
    ancestor.stringified = toLower(JSON.stringify(ancestor)) // for search
    await ProductStorage.save(ancestor)
  }

  return product
}

export const syncGroup = async (group_id: number) => {
  // sync the group together with its product_ids
  const group = await getGroup(group_id)
  const products = await getProductsOfGroup(group_id)
  const assets = await getAssetsOfGroup(group_id)
  const product_ids = map(products, 'id')
  const asset_ids = map(assets, 'id')

  let record, explicitIds

  record = await GroupStorage.find(group_id)
  explicitIds = get(record, `product_ids`, [])
  group.product_ids = uniq(concat(explicitIds, product_ids))
  await GroupStorage.save(group)

  // since there are no stand alone assets
  // find assets connected to product and sync
  product_ids.forEach(async (id) => {
    const productAssets = await getMarketingAssets(id)
    if (noCommonElements(map(productAssets, 'id'), asset_ids)) {
      await syncProducts(id, null)
      return
    }

    each(productAssets, async (asset) => {
      if(asset_ids.includes(asset.id)) {
        const item = await getVideoItem(asset.id)
        await syncProducts(id, asset.id)
        await syncAssets(id, asset.id, {item}, group_id)
        await downloadAsset(item)
      }
    })
  })

  // remove videos from local storage that are not connected to any group or product
  const storageAssets = await AssetStorage.getAll()
  storageAssets.forEach(async (asset) => {
    if(isEmpty(asset.group_ids) && isEmpty(asset.product_ids)) {
      dropMetadataByVideoId(asset.id)
      await MPPlayer.removeVideo(asset.id)
    }
  })
}

// deletes a video + all products that were connected only to this video
export const dropMetadataByVideoId = async(video_id: number): Promise<void> => {
  await AssetStorage.remove(video_id)

  const products = await ProductStorage.getProductsByVideoId(video_id)

  for (let i in products) {
    const product = products[i]
    const implicitIds = without(product.implicit_video_ids, video_id)

    // if this was the last remaining asset connected to the product, drop the product
    if (isEmpty(implicitIds)) {
      await ProductStorage.remove(product.id)
    } else {
      product.implicit_video_ids = implicitIds
      product.video_ids = without(product.video_ids, video_id)
      await ProductStorage.save(product)
    }
  }

  await Promise.all([
    AssetStorage.persist(),
    ProductStorage.persist(),
  ])
}

// deletes a product with all its children and assets
export const dropMetadataByProductId = async(product_id: number): Promise<void> => {
  const product = await ProductStorage.find(product_id)

  if (!product) return

  const videoIds = product.implicit_video_ids
  const videos = AssetStorage.getAssetsById(videoIds)
  const descendants = ProductStorage.getDescendants(product_id)

  await ProductStorage.remove(product)

  let i

  for (i in videos) {
    await AssetStorage.remove(videos[i])
  }

  for (i in descendants) {
    await ProductStorage.remove(descendants[i])
  }

  await Promise.all([
    AssetStorage.persist(),
    ProductStorage.persist(),
  ])
}

export const dropMetadataByGroupId = async(group_id: number): Promise<void> => {
  const group = await GroupStorage.find(group_id)

  if (!group) return

  const assets = await AssetStorage.list()
  await GroupStorage.remove(group)

  each(assets, (asset) => {
    if (asset.group_ids.includes(group_id)) {
      asset.group_ids = without(asset.group_ids, group_id)
      AssetStorage.save(asset)
    }
  })
}

export const clearMetadata = async (): Promise<any> => {
  return await Promise.all([
    AssetStorage.clear(),
    ProductStorage.clear(),
  ])
}

const getVideoItem = async(assetId: number): Promise<void> => {
  const playlistURL = await getVideoUrl(assetId)
  const item = MPPlayer.makeItem({
    assetId,
    playlistURL
  }, `inQueue`)

  return item
}

export const downloadAsset = async(item: any): Promise<void> => {
  // check first if the video is already downloaded
  await MPPlayer.downloadVideo(item)
}
