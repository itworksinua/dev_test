import { map, get, find } from 'lodash'
import chipmunk from 'chowchow/src/manager/chipmunk'
import { observable, computed, action, runInAction, IObservableArray } from 'mobx'
import { getFavorites, favorite, unfavorite } from '../lib/productApi'

export default class FavoritesStore {

  @observable public favorites = [] as IObservableArray

  private favoritesPromise: Promise<any>

  @action.bound
  public async load(): Promise<void> {
    const result = await getFavorites()
    this.favorites.replace(result.products)
  }

  @action.bound
  public async favorite(product_id: number): Promise<void> {
    await unfavorite(product_id)
    this.load()
  }

  @action.bound
  public async unfavorite(product_id: number): Promise<void> {
    await favorite(product_id)
    this.load()
  }

}
