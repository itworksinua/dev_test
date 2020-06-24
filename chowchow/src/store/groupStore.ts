import { observable, action, IObservableArray } from 'mobx'
import { find, toInteger } from 'lodash'
import { ProductStorage, AssetStorage, GroupStorage } from 'chowchow/src/lib/Storage'
import store from 'chowchow/src/store'
import { getGroups, getGroup, getProductsOfGroup, getAssetsOfGroup} from '../lib/groupsApi'

export default class GroupStore {
  @observable public groups = [] as IObservableArray
  @observable public groupProducts = [] as IObservableArray<any>
  @observable public groupAssets = [] as IObservableArray<any>
  @observable public group = {}

  @action.bound
  public async loadGroups() {
    const promise = store.network.connected
      ? getGroups()
      : GroupStorage.list()

    const groups = await promise

    this.groups.replace(groups)
  }

  @action.bound
  public async getGroup(groupId: number) {
    const promise = store.network.connected
      ? getGroup(groupId)
      : GroupStorage.find(groupId)

    const group = await promise

    this.group = group
  }

  @action.bound
  public async loadGroupProducts(groupId: number) {
    const group = find(this.groups, g => g.id === groupId)

    const promise = store.network.connected
      ? await getProductsOfGroup(groupId)
      : ProductStorage.getProductsByIds(group.product_ids)

    const groupProducts = await promise

    this.groupProducts.replace(groupProducts)

    return this.groupProducts
  }

  @action.bound
  public async loadGroupAssets(groupId: number) {
    const promise = store.network.connected
      ? await getAssetsOfGroup(groupId)
      : AssetStorage.getGroupAssets(groupId)

    const groupAssets = await promise

    this.groupAssets.replace(groupAssets)
  }
}
