import { map, get, find } from 'lodash'
import { observable, computed, action, runInAction, IObservableArray } from 'mobx'
import { loadSubscriptions, loadUserPreference } from '../lib/subscriptionApi'

export default class SubscriptionsStore {
  @observable public subscriptions = [] as IObservableArray
  @observable public subscriptionPreference

  @action.bound
  public async load() {
    const result = await loadSubscriptions()

    this.subscriptions.replace(result)
  }


  @action.bound
  public async getSubscriptionPreference() {
    const result = await loadUserPreference()

    this.subscriptionPreference = result
  }

}
