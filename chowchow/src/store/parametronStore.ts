import { isEmpty, each, first, reject, get, reverse, find, slice, isArray, includes } from 'lodash'
import { observable, action, computed, runInAction, IObservableArray, toJS } from 'mobx'
import { IParametron, IParametronData } from 'parametron'

export class ParametronStore {

  @observable public page: number
  @observable public per: number
  @observable public sort: string
  @observable public order: string
  @observable public totalCount: number
  @observable public totalPages: number
  @observable public running: boolean = false
  @observable public filters = []
  @observable public persistentFilters = []
  @observable public objects = [] as IObservableArray
  @observable public aggregations: any
  @observable public stats: string
  @observable public reqId: number

  public parametron: IParametron

  constructor(parametron: IParametron) {
    this.parametron = parametron
  }

  @action.bound
  public reset() {
    this.page = 1
    this.objects.replace([])
    this.aggregations = {}
  }

  @action.bound
  public update(data: Partial<IParametronData>, append = false) {
    each(data, (value, key) => {
      if (append && key === `objects`) {
        this.objects.replace(this.objects.concat(data.objects))
        return
      }

      if (isArray(value)) this[key] ? this[key].replace(value) : this[key] = value
      else this[key] = value
    })
  }

  @computed
  public get moreAvailable(): boolean {
    return get(this.totalPages, 0) > get(this.page, 0)
  }

}
