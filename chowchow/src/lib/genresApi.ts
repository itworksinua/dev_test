import { get, merge, reduce, union, map, each, find, includes } from 'lodash'
import chipmunk from 'chowchow/src/manager/chipmunk'

export const SCHEMA = `
  id, title,
  preview_image { url, distribution_url, signing_key },
  default_layer {category_ids, year_of_production}
`

export const gcuiCarousel = async (purpose) => {
  try {
    const group = (await chipmunk.action(`um.group`, `get_purpose`, {
      params: { purpose }
    })).object

    const itemParams = {
      group_ids: group.id,
      sort: `sequence_number`,
      order: `asc`,
    }

    const groupAssetsPromise = chipmunk.action('am.group/item', 'query', {
      params: merge({}, itemParams, { type: `group/item/asset` }),
      schema: `asset { preview_image, products { product_id } }`,
    })

    const groupProductsPromise = chipmunk.action('pm.group/item', 'query', {
      params: merge({}, itemParams, { type: `group/item/product` }),
      schema: `product_id, product { ${SCHEMA} } `,
    })

    await Promise.all([groupAssetsPromise, groupProductsPromise])
    const groupAssets = (await groupAssetsPromise).objects || []
    const groupProducts = (await groupProductsPromise).objects || []

    // assets have precedence
    const results = []

    if (groupAssets.length > 0) {
      const productIds = reduce(groupAssets, (ids, item) => {
        return union(ids, map(item.asset.products, `product_id`))
      }, [])

      const products = (await chipmunk.action('pm.product', 'get', {
        params: { product_ids: productIds },
        schema: SCHEMA,
      })).objects

      each(groupAssets, (item) => {
        const productIds = map(item.asset.products, `product_id`)
        const product = find(products, (p) => includes(productIds, p.id))

        if (!product) return

        results.push({
          product,
          preview_image: item.asset.preview_image,
        })
      })
    } else if (groupProducts.length > 0) {
      const productIds = map(groupProducts, `product_id`)

      const banners = (await chipmunk.action('pm.product/asset', 'query', {
        params: {
          product_ids: productIds,
          classification: `image/banner`,
          sort: `sequence_number`,
          order: `asc`,
          marketing_use: true,
        },
        schema: `product_id, asset { preview_image }`,
      })).objects

      each(groupProducts, (item) => {
        const banner = find(banners, (pa) => pa.product_id === item.product_id)

        results.push({
          product: item.product,
          preview_image: get(banner, `asset.preview_image`) || item.product.preview_image,
        })
      })
    }

    return results
  } catch (err) {
    return []
  }
}
