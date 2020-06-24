import {observable, action, runInAction, IObservableArray} from 'mobx'
import {getRecentlyViewed} from '../lib/productApi'

export default class RecentlyViewedStore {
  @observable public products = [] as IObservableArray

  @action.bound
  public async load() {
    const result = await getRecentlyViewed()
    this.products.replace(result)
  }
}
