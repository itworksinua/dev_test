import { map, get, find, isEmpty, compact, reduce, each } from 'lodash'
import { observable, computed, action, runInAction, IObservableArray, toJS } from 'mobx'
import { loadRecommendations, getRecommendationsAssets, getRecommendationsProducts, getRecommendationsUsers } from '../lib/recommendationApi'

export default class RecommendationStore {
  @observable public recommendations = [] as IObservableArray
  @observable public assets = [] as IObservableArray
  @observable public products = [] as IObservableArray
  @observable public users = [] as IObservableArray
  @observable public recommendation

  @action.bound
  public async load(userId) {
    const recommendations = await loadRecommendations(userId)
    this.recommendations.replace(recommendations)
  }

  @action.bound
  public async getAssets() {
    if (isEmpty(this.recommendations)) return

    const assetIds = this.flattenArray(map(this.recommendations, 'asset_ids'))
    const result = await getRecommendationsAssets(assetIds)

    this.assets.replace(result)
  }

  @action.bound
  public async getProducts() {
    if (isEmpty(this.recommendations)) return

    const productIds = this.flattenArray(map(this.recommendations, 'product_ids'))
    const result = await getRecommendationsProducts(productIds)

    this.products.replace(result)
  }

  @action.bound
  public async getUsers() {
    if (isEmpty(this.recommendations)) return

    const userId = map(this.recommendations, (r) => r.campaign.from_user_id)
    const result = await getRecommendationsUsers(userId)

    this.users.replace(result)
  }

  @action.bound
  public async getRecommendationById(id) {
    if (this.recommendations)
      this.recommendation = find(this.recommendations, {id: id})
  }

  // for some reason lodash flatten & compact does not work
  private flattenArray(arrays) {
    const newArray =
    reduce(arrays, (result, value) => {
      each(value, (v) => {
        result.push(v);
      })
      return result;
    }, []);

    return newArray
  }
}
