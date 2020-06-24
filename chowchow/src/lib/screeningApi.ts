import chipmunk from 'chowchow/src/manager/chipmunk'
import {map, each, filter} from 'lodash'
import {getAssetsById} from './assetApi'

export const loadScreenings = async (userId) => {
  const screenings = (await chipmunk.action('um.user', 'query_groups', {
    params: {
      user_ids: userId,
      q: 'type:("group/screening")',
    },
  })).objects

  return screenings
}

export const getScreeningAssets = async (screenings) => {
  try {
    const assetObjects = await chipmunk.action('am.group/item', 'query', { params: {group_ids: map(screenings, 'id'), sort: 'sequence_number'} })
    const ids = map(assetObjects.objects, 'asset_id');
    const assets = await getAssetsById(ids)

    each(assets, asset => {
      asset['screening_id'] = map(filter(assetObjects.objects, {asset_id: asset.id}), 'group_id');
    })

    return assets
  }

  catch (err) {
    if (err.statusCode === 404) {
      return []
    }

    else {
      throw err
    }
  }
}
