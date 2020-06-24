import chipmunk from 'chowchow/src/manager/chipmunk'
import { map, each, isEmpty } from 'lodash'

export const loadSubscriptions = async (): Promise<any> => {
  const subscriptions = (await chipmunk.action('sm.subscription', 'query')).objects
  if (isEmpty(subscriptions)) return []

  const products = (await chipmunk.action('pm.product', 'get', {
    params: { product_ids: map(subscriptions, 'product_id') },
    schema: `id, display_title`,
  })).objects

  each(subscriptions, (s) => {
    each(products, product => {
      if (product.id === s.product_id) {
        product.subscriptionId = s.id;
      }
    })
  })

  return products
}

export const loadUserPreference = async (): Promise<any> => {
  const userPreference = (await chipmunk.action('sm.subscription_settings', 'query')).object

  return userPreference
}

export const updateUserPreference = async (preferenceId, userId, value): Promise<any> => {
  const userPreference = await chipmunk.action('sm.subscription_settings', 'update', {
    params: {
      subscription_settings_ids: preferenceId,
      user_id: userId,
      frequency: value
    },
  })
}

export const deleteSubscriptions = async(ids): Promise<any> => {
  await chipmunk.action('sm.subscription', 'delete', {
    params: {
      subscription_ids: ids,
    },
  })
}

export const subscribe = async(productId, userId): Promise<any> => {
  await chipmunk.action('sm.subscription', 'create', {
    body: {
      product_id: productId,
      user_id: userId,
      include_children: true,
      asset_types: ['video'],
    }
  })
}

export const unsubscribe = async(ids): Promise<any> => {
  deleteSubscriptions(ids)
}
