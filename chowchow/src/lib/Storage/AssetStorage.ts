import Storage from './Storage'
import { filter, isArray, intersection, each, includes } from 'lodash'
import { IAsset } from 'chowchow/src/lib/interfaces'
import { ProductStorage } from '.'

class AssetStorage extends Storage<IAsset> {

  public constructor(){
    super(`AssetStorage-Objects`)
  }

  public async getProductAssets(productId: number, type = ``): Promise<IAsset[]> {
    const ids = [productId]

    if (type === `season`) {
      const episodes = await ProductStorage.getChildren(productId)

      each(episodes, x => ids.push(x.id))
    }

    return filter(await this.list(), (asset) => {
      const intersectArray = intersection(asset.product_ids, ids)

      return (intersectArray && intersectArray.length && intersectArray.length > 0)

    })
  }

  public async getAssetsById(asset_ids: number | number[]): Promise<IAsset[]> {
    const ids = isArray(asset_ids) ? asset_ids : [asset_ids]

    return filter(await this.list(), x => includes(ids, x.id))
  }

  public async getGroupAssets(groupId: number): Promise<IAsset[]> {

    return filter(await this.list(), x => includes(x.group_ids, groupId))
  }

  public async getAll(): Promise<IAsset[]> {
    const list = await this.list()

    return list
  }

}

export default AssetStorage
