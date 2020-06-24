import {map, isArray, compact} from 'lodash'
import chipmunk from 'chowchow/src/manager/chipmunk'
import {LIST_SCHEMA} from './productApi'
import {SCHEMA} from './assetApi'

export const getGroups = async() => {
  const groups = (await chipmunk.action(`um.group`, `query`, {
    params: {
      q: `type:("group/mobile_sync")`
    },
    schema: `id, name`,
  })).objects

  return groups
}

export const getGroup = async(groupId: number) => {
  const ids = isArray(groupId) ? groupId : [groupId]
  const group = (await chipmunk.action(`um.group`, `get`, {
    params: {
      group_ids: ids,
      q: `type:("group/mobile_sync")`
    },
    schema: `id, name, product_ids`,
  })).object

  return group
}

export const getProductsOfGroup = async(groupId: number) => {
  const group_ids = isArray(groupId) ? groupId : [groupId]
  const params = {
    group_ids,
    per: 250,
    sort: 'sequence_number',
    order: 'asc',
    type: 'group/item/product',
  }

  const products = (await chipmunk.action('pm.group/item', 'query', {
    params,
    schema: `product { ${LIST_SCHEMA} }`,
  })).objects

  return compact(map(products, 'product'))
}


export const getAssetsOfGroup = async(groupId: number) => {
  const group_ids = isArray(groupId) ? groupId : [groupId]
  const params = {
    group_ids,
    per: 250,
    sort: 'sequence_number',
    order: 'asc',
    type: 'group/item/asset',
  }

  const assets = (await chipmunk.action('am.group/item', 'query', {
    params,
    schema: `asset { ${SCHEMA} }`,
  })).objects

  return compact(map(assets, 'asset'))
}
