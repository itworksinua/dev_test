import chipmunk from 'chowchow/src/manager/chipmunk'
import {map, each, filter} from 'lodash'
import {getAssetsById} from './assetApi'
import {SCHEMA} from './assetApi'
import {LIST_SCHEMA} from './productApi'

export const USER_SCHEMA = `
  id, first_name, last_name
`
export const RECOMMENDATION_SCHEMA = `
  id, created_at, expires_at, asset_ids, product_ids, views_left,
  campaign { recommendation_access_level, protection_levels, views_granted, message,
    subject, target, from_user_id, target_group_id, recommendation_access_level }
`

export const loadRecommendations = async (userId) => {
  const res = await chipmunk.action('mc.email', 'user_query', {
    schema: RECOMMENDATION_SCHEMA
  })

   // do not show expired recommendations
  const filteredRecommendation = filter(res.objects, (r) => r.views_left !== -1 || new Date(r.expires_at) < new Date())

  return filteredRecommendation
}

export const getRecommendationsAssets = async(asset_ids) => {
  const res = await chipmunk.action('am.asset', 'get', {
    params: {asset_ids},
    schema: SCHEMA
  })

  return res.objects
}

export const getRecommendationsProducts = async(product_ids) => {
  const res = await chipmunk.action('pm.product', 'get', {
    params: { product_ids },
    schema: LIST_SCHEMA
  })

  return res.objects
}

export const getRecommendationsUsers = async(user_ids) => {
  const res = await chipmunk.action('um.user', 'get', {
    params: { user_ids },
    schema: USER_SCHEMA
  })

  return res.objects
}
