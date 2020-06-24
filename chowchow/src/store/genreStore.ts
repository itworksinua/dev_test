import { observable, action, IObservableArray } from 'mobx'
import { gcuiCarousel } from '../lib/genresApi'
import { createParametron, IParametronData } from 'parametron'

import { ParametronStore } from './parametronStore'

import { LIST_SCHEMA } from 'chowchow/src/lib/productApi'
import chipmunk from 'chowchow/src/manager/chipmunk'

export default class GenreStore {

  @observable public genreProducts: ParametronStore
  @observable public loading = false
  @observable public heroProducts = [] as IObservableArray

  public constructor() {
    const parametron = createParametron({
      model: `pm.product`,
      action: `search`,
      schema: LIST_SCHEMA,
      immediate: false,
      init: (api) => {
        api.setPersistent('preview_image_id', 'exist')
      },
      update: (data: IParametronData) => {
        this.genreProducts.update(data, true)
        this.loading = false
      },
    }, chipmunk)

    this.genreProducts = new ParametronStore(parametron)
  }

  @action.bound
  public async getHeroProducts(id) {
    const result = await gcuiCarousel(`category_hero_${id}`)

    this.heroProducts.replace(result)
  }

  @action.bound
  public async filterProductsByCategory(descendantIds: any) {
    this.clear()
    const { parametron: { api } } = this.genreProducts

    api.params({ page: 1 })
    api.set(`category_ids`, `in`, descendantIds)
  }

  @action.bound
  public clear(): void {
    this.genreProducts.reset()
  }

}
