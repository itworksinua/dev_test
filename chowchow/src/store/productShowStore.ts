import { observable, computed, action, IObservableArray } from 'mobx'
import { ProductStorage, AssetStorage } from 'chowchow/src/lib/Storage'
import { getProduct, getSeasons } from 'chowchow/src/lib/productApi'
import { getProductAssets } from 'chowchow/src/lib/assetApi'
import { get, filter, includes } from 'lodash'
import store from 'chowchow/src/store'
import { StringLiteral } from '@babel/types'
import { IFullProduct, ISlimProduct, IAsset } from 'chowchow/src/lib/interfaces'

export default class ProductShowStore {

  @observable public product: IFullProduct = null
  @observable public seasons = [] as IObservableArray<ISlimProduct>
  @observable public assets = [] as IObservableArray<IAsset>

  @action.bound
  public async getProductWithAssetsAndSeasons(productId: number): Promise<any> {
    await this.getProduct(productId)

    const type = get(this.product, `type`)

    await this.getAssets(productId, type)

    if (type === `series`) {
      this.getSeasons(productId)
    }
  }

  @action.bound
  public async getProduct(productId: number): Promise<any> {
    const promise = store.network.connected
      ? getProduct(productId)
      : ProductStorage.find(productId)

    this.product = await promise

    return this.product
  }

  @action.bound
  // HINT: make sure to pass product.type for seasons to get episode assets
  public async getAssets(productId: number, type?): Promise<any> {
    const promise = store.network.connected
      ? getProductAssets(productId, type)
      : AssetStorage.getProductAssets(productId, type)

    const assets = await promise

    this.assets.replace(assets)

    return this.assets
  }

  @action.bound
  // HINT: should be called for a 'series' product id only
  public async getSeasons(productId: number): Promise<void> {
    const promise = store.network.connected
      ? getSeasons(productId)
      : ProductStorage.getChildren(productId)

    const seasons = await promise

    this.seasons.replace(seasons)
  }

  @computed
  public get videoAssets(): any[] {
    return filter(this.assets, x => includes(x.classification, `video`))
  }

}
