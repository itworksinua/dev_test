import chipmunk from 'chowchow/src/manager/chipmunk'
import { get, merge, map, each, last, isEmpty } from 'lodash'
import striptags from 'striptags'

export const LIST_SCHEMA = `
  id, title,
  display_title, episodes_count, seasons_count,
  default_layer {
    year_of_production, duration,
  },
  preview_image { url, signing_key, distribution_url }
`

// should satisfy both list and show views
export const EXT_SCHEMA = `
  id, parent_id, title, sequence_number, ancestry,
  display_title, episodes_count, seasons_count,
  default_layer {
    synopsis, long_synopsis, web_page, category_ids, country,
    year_of_production, duration, casts { name }, crews { name, role }
  },
  preview_image { url, signing_key, distribution_url }
`

export interface IProductAndAncestors {
  product: any;
  ancestors: any[];
}

const convertFromHtml = (html): string => {
  let result = html

  result = result.replace(/[\n\r]+/g, ` `)                     // remove carriage returns
  result = result.replace(/\s{2,}/g, ` `)                     // remove more than 1 subsequent whitespaces
  result = result.replace(/<br\s?\/?>|<\/p\s?\/?>/ig, `<br>`) // unify html linebreaks to <br>
  result = striptags(result, `<br>`)                          // remove all html tags except for linebreaks
  result = result.replace(/<br>/ig, `\n`)                     // finally subsitute linebreaks with carriage returns
  result = result.trim()

  return result
}

const extendProduct = (product) => {
  product.type = last(product[`@type`].split(`/`))

  let html

  if (html = get(product, `default_layer.synopsis`)) {
    product.default_layer.synopsis = convertFromHtml(html)
  }

  if (html = get(product, `default_layer.long_synopsis`)) {
    product.default_layer.long_synopsis = convertFromHtml(html)
  }
}

export const getProduct = async (product_id: number): Promise<any> => {
  // TODO: need to use member get here because collection get does not support Mpx-Trace!
  // see https://issues.mediapeers.com/issues/62216
  const product = (await chipmunk.action(`pm.product`, `member.get`,
  {
    params: { product_id: product_id },
    headers: { 'Mpx-Trace': 'true' },
    schema: EXT_SCHEMA,
  })).object

  extendProduct(product)

  return product
}

export const getProductAndAncestors = async (product_id: number): Promise<IProductAndAncestors> => {
  const product = await getProduct(product_id)

  if (isEmpty(product.ancestry)) return {
    product,
    ancestors: [],
  }

  const ancestorIds = product.ancestry.split(`/`)
  const promises = map(ancestorIds, getProduct)
  const ancestors = await Promise.all(promises)

  const result = {
    product,
    ancestors,
  }

  return result
}

export const getProducts = async (page = 1, search?: string): Promise<any> => {
  const body = {
    page,
    per: 10,
    search: { filters: [
      [`preview_image_id`, `exist`,],
    ], },
  }

  if (!isEmpty(search)) {
    body.search.filters.push([`_`, `q`, search])
  }

  const result = (await chipmunk.action(`pm.product`, `search`, {
    body,
    schema: LIST_SCHEMA,
  }))

  const products = result.objects as any

  each(products, extendProduct)

  if (get(result, 'pagination.total_pages') > page) {
    products.moreAvailable = true
  }

  return products
}

// can be replaced by query that filters for parent_id ??
export const getSeasons = async (product_id: number): Promise<any> => {
  const products = (await chipmunk.action(`pm.product`, `query_descendants`, {
    params: {
      product_id,
      type: `product/motion_picture/season`,
      sort: `flat_sequence_number`,
      order: `asc`,
    },
    schema: LIST_SCHEMA,
  })).objects

  each(products, extendProduct)

  return products
}

export const getEpisodeIds = async (product_id: number): Promise<number[]> => {
  const products = (await chipmunk.action(`pm.product`, `query_descendants`, {
    params: {
      product_id,
      type: `product/motion_picture/episode`,
      sort: `flat_sequence_number`,
      order: `asc`,
    },
    schema: `id`,
  })).objects

  const ids = map(products, `id`)

  return ids
}

export const getRecentlyViewed = async (): Promise<any[]> => {
  const products = (await chipmunk.action(`pm.product`, `recently_viewed`, {
    params: {
      q: `_exists_:preview_image_id`,
      sort: `updated_at`,
      order: `desc`,
    },
    schema: LIST_SCHEMA,
  })).objects

  return products
}

export const getFavorites = async (params?) => {
  const result = (await chipmunk.action(`pm.product`, `query_favorites`, {
    params: merge({
      q: `_exists_:preview_image_id`,
    }, params),
    schema: LIST_SCHEMA,
  }))

  const { objects: products, pagination: { total_pages } } = result

  each(products, (p) => p.favorite = true)

  return {
    products,
    totalPages: total_pages,
  }
}

export const favorite = async(product_id) => {
  await chipmunk.action(`pm.product`, `favorite`, {
    params: {
      product_id
    },
  })
}

export const unfavorite = async(product_id) => {
  await chipmunk.action(`pm.product`, `unfavorite`, {
    params: {
      product_id
    }
  })
}
