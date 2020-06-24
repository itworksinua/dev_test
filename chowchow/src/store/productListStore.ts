import { isEmpty, isArray } from 'lodash'
import { observable, computed, action, IObservableArray } from 'mobx'
import { createParametron, IParametronData } from 'parametron'

import { ProductStorage } from 'chowchow/src/lib/Storage'
import { ParametronStore } from './parametronStore'
import store from 'chowchow/src/store'
import chipmunk from 'chowchow/src/manager/chipmunk'

import { LIST_SCHEMA } from 'chowchow/src/lib/productApi'

export default class ProductListStore {

  @observable public products: ParametronStore
  @observable public search = ``
  @observable public loading = false

  public constructor() {
    const parametron = createParametron({
      model: `pm.product`,
      action: `search`,
      stats: 'access_level,type,categories,duration,year_of_production,resolution,languages',
      schema: LIST_SCHEMA,
      immediate: false,
      init: (api) => {
        api.setPersistent(`preview_image_id`, `exist`)
      },
      update: (data: IParametronData) => {
        this.products.update(data, true)
      },
    }, chipmunk)

    this.products = new ParametronStore(parametron)
  }

  @action.bound
  public async loadProducts(): Promise<void> {
    const { parametron: { api } } = this.products

    this.loading = true

    if (store.network.connected) {
      if (isEmpty(this.search)) {
        await api.clear(`_`, `q`)
      } else {
        await api.set(`_`, `q`, this.search)
      }
    } else {
      const objects = await ProductStorage.search(this.search)
      this.products.update({ objects, totalCount: objects.length, totalPages: 1 })
    }

    this.loading = false
  }

  @action.bound
  public async loadMore(): Promise<void> {
    if (!store.network.connected) return // pagination doesn't make sense when offline

    const { parametron } = this.products
    const { data: { page, totalPages }, api } = parametron

    if (page < totalPages) {
      api.params({ page: page+1 })
    }
  }

  @action.bound
  public async startLoading(): Promise<void> {
    this.loading = true
    this.clear()
    await this.loadProducts()
  }

  @action.bound
  public async startSearch(term: string) {
    this.loading = true
    this.clear()
    this.search = term

    await this.loadProducts()
  }

  @action.bound
  public filterByCategory(descendantIds: any) {
    this.clear()
    const { parametron: { api } } = this.products

    api.set(`category_ids`, `in`, descendantIds)
    this.loadProducts()
  }

  @action.bound
  public filterByFieldName(field, value, params = {only_roots: true}) {
    this.clear()
    const {parametron: {api}} = this.products
    field.params ? api.params(field.params) : api.params(params)

    isArray(value) ? api.set(field.name, field.action, value[0], value[1]) : api.set(field.name, field.action, value)
    this.loadProducts()
  }

  @action.bound
  public clear(): void {
    this.products.reset()
  }

  @action.bound
  public clearAll(): void {
    this.clear()
    const {parametron: {api}} = this.products
    api.params({only_roots: true})
    api.clear()
    this.loadProducts()
  }
}
