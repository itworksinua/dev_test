import chipmunk from 'chowchow/src/manager/chipmunk'
import moment from "moment"
import CryptoJS from "crypto-js"
import { includes, get, map, isArray, isEmpty, sortBy, union } from 'lodash'
import { getEpisodeIds } from './productApi'
import { IAsset } from './interfaces'
import { AssetStorage } from './Storage'
import { makeItem } from 'react-native-mediapeers'

export const BITRATE = (2000000)/8 // in Bytes per second

export const SCHEMA = `
  id, name, classification, duration, updated_at,
  preview_image { url, distribution_url, signing_key },
`

export const VIDEO_CLASSIFICATIONS = [
  `video/trailer`,
  `video/screener`,
]

const VISCACHA_OPTS = {
  rawRequest: true,
  rawResult: true,
}

const extendAssets = async (assets: IAsset | IAsset[]): Promise<void> => {
  if (!isArray(assets)) assets = [assets]

  for (let i in assets) {
    const asset = assets[i]

    if (includes(asset[`@type`], `video`)) {
      asset.type = `video`
      asset.estimatedSize = Math.round(get(asset, `duration`, 0) * BITRATE)

      // extend with stored IMPPlayerItem info or create empty item
      const stored = await AssetStorage.find(asset.id)

      asset.item = get(stored, `item`, makeItem({ assetId: asset.id }))
    } else {
      asset.type = `other`
    }
  }
}

export const getVideoUrl = async (asset_id: number): Promise<any> => {
  const token = CryptoJS.SHA1(`vod:${asset_id}:H5UFa94CrhThkT68`).toString()
  const params = { video_url_id: asset_id }
  const headers = { 'Mpx-Token': token }

  const result = await chipmunk.action('am.asset/video_url', 'member.app', { params, headers })
  return result.object.hls
}

export const getVideo = async (asset_id: number): Promise<IAsset> => {
  const result = await chipmunk.action('am.asset', 'get', {
    params: { asset_ids: asset_id },
    schema: SCHEMA,
  })

  const video = result.object as any

  await extendAssets(video)
  return video
}

export const getMarketingAssets = async (product_id: number, classifications = []): Promise<IAsset[]> => {
  const params = {
    product_ids: product_id,
    marketing_use: true,
    sort: `sequence_number`,
    order: `asc`,
  }

  const productAssets = (await chipmunk.action(`pm.product/asset`, `query`, { params })).objects

  if (isEmpty(productAssets)) {
    return []
  }

  const sortedAssetIds = map(productAssets, `asset_id`)

  const body = {
    search: { filters: [
      [`id`, `in`, sortedAssetIds],
      [`preview_image_id`, `exist`],
      [`file_status`, `eq`, `ready`],
    ], },
  }

  if (!isEmpty(classifications)) {
    body.search.filters.push([`classification`, `in`, classifications])
  }

  let assets = (await chipmunk.action('am.asset', 'search', {
    body,
    schema: SCHEMA,
  })).objects as any[]

  assets = sortBy(assets, x => sortedAssetIds.indexOf(x.id)) // sort by original order
  await extendAssets(assets)

  return assets
}

export const getProductsAssets = async (product_ids: number[], classifications = []): Promise<IAsset[]> => {
  const product_id = product_ids.join(`,`)

  const body = {
    per: 10,
    product_id,
    search: { filters: [
      [`preview_image_id`, `exist`],
      [`file_status`, `eq`, `ready`],
    ], },
  } as any

  if (!isEmpty(classifications)) {
    body.search.filters.push([`classification`, `in`, classifications])
  }

  const assets = (await chipmunk.action('am.asset', 'search', {
    body,
    schema: SCHEMA,
  })).objects as any[]

  await extendAssets(assets)

  return assets
}

export const getProductAssets = async(product_id: number, type = ``, classifications = []): Promise<IAsset[]> => {
  if (type === `season`) {
    // fetch season's marketing assets + episode videos
    const episodeIds = await getEpisodeIds(product_id)

    let marketingAssets, episodeVideos

    [marketingAssets, episodeVideos] = await Promise.all([
      getMarketingAssets(product_id, classifications),
      getProductsAssets(episodeIds, VIDEO_CLASSIFICATIONS),
    ])

    // mark episodes as episodes here

    return union(marketingAssets, episodeVideos)
  } else {
    return getMarketingAssets(product_id, classifications)
  }
}

export const getAssetsById = async(asset_ids: number[]) => {
  const result = await chipmunk.action('am.asset', 'get', {
    params: { asset_ids },
    schema: SCHEMA,
  })

  return result.objects
}
