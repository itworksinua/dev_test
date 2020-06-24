import { map, includes, find, isEmpty } from 'lodash'
import { makeItem } from 'react-native-mediapeers'

import { IAsset } from 'chowchow/src/lib/interfaces'
import SessionStore from './sessionStore'
import BasicsStore from './basicsStore'
import GenreStore from './genreStore'
import HomeScreenStore from './homeScreenStore'
import ProductListStore from './productListStore'
import ProductShowStore from './productShowStore'
import RecentlyViewedStore from './recentlyViewedStore'
import FavoritesStore from './favoritesStore'
import ProfileStore from './profileStore'
import ScreeningStore from './screeningStore'
import RecommendationStore from './recommendationStore'
import SubscriptionsStore from './subscriptionsStore'
import DownloadStore from './downloadStore'
import OrientationStore from './orientationStore'
import AppStateStore from './appStateStore'
import NetworkStore from './networkStore'
import GroupStore from './groupStore'

export interface IStore {
  session: SessionStore;
  productList: ProductListStore;
  basicsStore: BasicsStore;
  homeStore: HomeScreenStore;
  favoritesStore: FavoritesStore;
  download: DownloadStore;
  profileStore: ProfileStore;
  screeningStore: ScreeningStore;
  recommendationStore: RecommendationStore;
  subscriptionsStore: SubscriptionsStore;
  orientation: OrientationStore;
  appState: AppStateStore;
  network: NetworkStore;
  group: GroupStore;
  recentlyViewedStore: RecentlyViewedStore;
  getProductShowStore: (number) => ProductShowStore;
  destroyProductShowStore: (number) => void;
  getGenreStore: (number) => GenreStore;
  destroyGenreStore: (number) => void;
}

// idea here is that we have a store instance for
// each product show page, identified by the product's id
const productShowStores = {}
const genreStores = {}

const store: IStore = {
  session: new SessionStore(),
  basicsStore: new BasicsStore(),
  homeStore: new HomeScreenStore(),
  productList: new ProductListStore(),
  favoritesStore: new FavoritesStore(),
  profileStore: new ProfileStore(),
  screeningStore: new ScreeningStore(),
  recommendationStore: new RecommendationStore(),
  subscriptionsStore: new SubscriptionsStore(),
  download: new DownloadStore(),
  orientation: new OrientationStore(),
  appState: new AppStateStore(),
  network: new NetworkStore(),
  group: new GroupStore(),
  recentlyViewedStore: new RecentlyViewedStore(),
  getProductShowStore: (productId: number): ProductShowStore => {
    if (productShowStores[productId]) return productShowStores[productId]
    return productShowStores[productId] = new ProductShowStore()
  },
  destroyProductShowStore: (productId: number): void => {
    delete productShowStores[productId]
  },
  getGenreStore: (genreId: number): GenreStore => {
    if (genreStores[genreId]) return genreStores[genreId]
    return genreStores[genreId] = new GenreStore()
  },
  destroyGenreStore: (productId: number): void => {
    delete productShowStores[productId]
  },
}

// when locally stored assets got updated, i.e. on progress
export const updateAssets = (assets: IAsset[]) => {
  if (isEmpty(assets)) return

  for (let productId in productShowStores) {
    const store = productShowStores[productId] as ProductShowStore

    const list = map(store.assets, (a) => {
      const replacement = find(assets, { id: a.id })

      return replacement || a
    })

    store.assets.replace(list)
  }
}

// when locally stored assets got removed
export const resetAssets = (removedAssetIds: number[]) => {
  if (isEmpty(removedAssetIds)) return

  for (let productId in productShowStores) {
    const store = productShowStores[productId] as ProductShowStore

    const list = map(store.assets, (a) => {
      if (includes(removedAssetIds, a.id)) {
        a.item = makeItem({ assetId: a.id })
      }

      return a
    })

    store.assets.replace(list)
  }
}

export default store
