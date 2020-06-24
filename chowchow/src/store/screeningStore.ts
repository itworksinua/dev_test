import { map, get, find } from 'lodash'
import { observable, computed, action, runInAction, IObservableArray } from 'mobx'
import { loadScreenings, getScreeningAssets } from '../lib/screeningApi'

export default class ScreeningStore {
  @observable public screenings = [] as IObservableArray
  @observable public screeningAssets = [] as IObservableArray
  @observable public screening

  @action.bound
  public async load(userId) {
    const result = await loadScreenings(userId)

    this.screenings.replace(result)
  }

  @action.bound
  public async getScreeningAssets() {
    const result = await getScreeningAssets(this.screenings)

    this.screeningAssets.replace(result)
  }

  @action.bound
  public async getScreeningById(id) {
    this.screening = find(this.screenings, {id: id})
  }
}
