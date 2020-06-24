import Storage from './Storage'
import { filter, includes, isEmpty, find, toLower, toInteger, isArray } from 'lodash'
import { IFullProduct } from 'chowchow/src/lib/interfaces'

class ProductStorage extends Storage<IFullProduct> {

  public constructor(){
    super(`ProductStorage-Objects`)
  }

  public async getProductsByVideoId(asset_id: number): Promise<any[]> {
    return filter(await this.list(), x => includes(x.implicit_video_ids, asset_id))
  }

  public async getRootProducts(): Promise<any[]> {
    const list = await this.list()
    const filtered = filter(list, x => !x.parent_id)

    return filtered
  }

  public async getProductById(id: any): Promise<IFullProduct> {
    const list = await this.list()
    const found = find(list, x => x.id === toInteger(id))

    return found
  }

  public async getProductsByIds(ids: number | number[]): Promise<IFullProduct[]> {
    const product_ids = isArray(ids) ? ids : [ids]

    return filter(await this.list(), x => includes(product_ids, x.id))
  }

  public async getChildren(parent_id: number): Promise<IFullProduct[]> {
    const list = await this.list()

    return filter(list, { parent_id })
  }

  public async getDescendants(product_id: number): Promise<IFullProduct[]> {
    const list = await this.list()

    return filter(list, x => includes(x.ancestor_ids, product_id))
  }

  // local search / filter
  public async search(search?: string): Promise<IFullProduct[]> {
    const list = await this.list()

    return isEmpty(search)
      ? list
      : filter(list, x => includes(x.stringified, toLower(search)))
  }

}

export default ProductStorage
