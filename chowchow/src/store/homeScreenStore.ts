import { isEmpty, merge, each, first, reject, get, reverse, assign, find, slice, map, isArray, includes } from 'lodash'
import { observable, action, runInAction, IObservableArray } from 'mobx'
import { catDescendantIds } from 'tuco/src/lib/helpers'
import { gcuiCarousel } from '../lib/genresApi'
import { getRecentlyViewed } from '../lib/productApi'
import chipmunk from 'chowchow/src/manager/chipmunk'
import store from 'chowchow/src/store'

export default class HomeScreenStore {

  @observable public heroItems = [] as IObservableArray
  @observable public categoryImages = [] as IObservableArray
  @observable public productsByCategory: {}

  @action.bound
  public async loadHeroSlider() {
    const result = await gcuiCarousel(`home_hero_slider`)

    this.heroItems.replace(result)
  }

  @action.bound
  public async loadCategoryImages(categories) {
    const results = []
    const promises = []

    for (const cat of categories) {
      const count = get(cat, `products_count`, 0)

      results.push({
        category: merge({}, cat, { count }),
        previewImage: cat.preview_image,
      })

      if (!cat.preview_image) {
        const categoryIds = catDescendantIds(categories, cat) // returns all relevant ids (self + descendants)

        const promise = chipmunk.action(`pm.product`, `search`, {
          body: {
            per: 1,
            search: { filters: [
              [`category_ids`, `in`, categoryIds],
              [`preview_image_id`, `exist`],
            ] },
          },
          schema: `preview_image { url, distribution_url, signing_key }`,
        }).then((res) => {
          if (!res.object) return

          // update preview image of category
          const entry = find(results, (entry) => entry.category.id === cat.id)

          entry.preview_image = entry.category.previewImage ? entry.category.previewImage : res.object.preview_image
        })

        promises.push(promise)
      }
    }

    await Promise.all(promises)
    this.categoryImages.replace(results)
  }

  public async loadProducts(categories, params = {}) {

    if (isEmpty(categories)) return

    for (const category of categories) {
      await this.loadCategoryProducts(category, params)
    }

    return this.productsByCategory
  }

  @action.bound
  private async loadCategoryProducts(category, params) {
    const {basicsStore} = store
    await basicsStore.loadBasics()
    const {categories} = basicsStore

    const categoryIds = catDescendantIds(categories, category)
    const catIds = categoryIds.map(i => `"` + i + `"`).join(` OR `)

    params = merge({
      per: 12,
      only_roots: `false`,
      order: `desc`,
      sort: `display_title`,
      q: `type:("product/motion_picture/season" OR "product/motion_picture/program" OR "product/motion_picture/format") AND category_ids:(${catIds})`,
    }, params)

    const products = (await chipmunk.action(`pm.product`, `query`, {
      params,
      schema: `
        id, title,
        sequence_number,
        default_layer { name, subtitle, synopsis, category_ids },
        preview_image { url, signing_key, distribution_url }
      `,
    })).objects

    if (isEmpty(products)) {
      return []
    }

    this.productsByCategory = assign(this.productsByCategory, { [category.name]: products })
  }

}
