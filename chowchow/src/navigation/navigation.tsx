import * as React from "react"
import { Navigation, Options } from "react-native-navigation"
import { Provider } from "mobx-react"
// import { get } from "lodash"

import store from "../store"
import defaultOptions from "./defaultOptions"

import SettingsScreen from '../screens/Settings'
import PrivateScreen from '../screens/Private'
import ProfileScreen from '../screens/Profile'
import LoginScreen from '../screens/Login'
import SearchListScreen from '../screens/SearchList'
import ProductShowScreen from '../screens/ProductShow'
import DownloadProductListScreen from '../screens/DownloadProductList'
import DownloadProductShowScreen from '../screens/DownloadProductShow'
import FullscreenVideo from '../screens/FullscreenVideo'
import GenreShowScreen from '../screens/GenreShow'
import HomeScreen from '../screens/HomeScreen'
import FilterModal from '../screens/Filter'
import FavoritesScreen from '../screens/Favorites'
import RecommendationsScreen from '../screens/Recommendations'
import RecommendationsShowScreen from '../screens/RecommendationsShow'
import ScreeningsScreen from '../screens/Screenings'
import ScreeningsShowScreen from '../screens/ScreeningsShow'
import SubscriptionsScreen from '../screens/Subscriptions'
import RecentlyViewed from '../screens/RecentlyViewed'
import GenreModal from '../screens/GenreModal'
import SyncsList from '../screens/SyncsList'
import SyncShow from '../screens/SyncShow'

import appStack from "./appStack"
import authStack from "./authStack"

import { listenForClosingVideo } from './videoStack'
import { hideSpinner } from './spinnerStack'

export { showGenreModal } from "./genreStack"
export { showSpinner, hideSpinner } from './spinnerStack'
export { showFilter, hideFilter } from './filterStack'
export { showVideo, hideVideo } from "./videoStack"

import SelectableTitle from '../components/SelectableTitle'
import TopbarTrash from '../components/TopbarTrashButton'
import NavbarLogo from '../components/NavbarLogo'
// import DownloadingBadge from '../components/DownloadingBadge'
import Spinner from '../components/Spinner'

/* eslint-disable */
enum StackTypes {
  none = "None",
  auth = "AuthStack",
  app = "AppStack",
}

enum Tabs {
  home,
  search,
  downloads,
  profile
}
/* eslint-enable */

/**
 * Set it up
 */
export const init = (): void  => {

  registerComponents()

  Navigation.events().registerAppLaunchedListener(() => {

    // tslint:disable
    Navigation.setDefaultOptions(defaultOptions as Options)

    goToAuth()

    listenForClosingVideo()
  })
}

/**
 * Register the components for RNN
 */
export function registerComponents(): void {

  registerComponentWithStore(LoginScreen)
  registerComponentWithStore(SearchListScreen)
  registerComponentWithStore(ProductShowScreen)
  registerComponentWithStore(DownloadProductListScreen)
  registerComponentWithStore(DownloadProductShowScreen)
  registerComponentWithStore(PrivateScreen)
  registerComponentWithStore(SettingsScreen)
  registerComponentWithStore(ProfileScreen)
  registerComponentWithStore(FullscreenVideo)
  registerComponentWithStore(GenreShowScreen)
  registerComponentWithStore(HomeScreen)
  registerComponentWithStore(FavoritesScreen)
  registerComponentWithStore(RecommendationsScreen)
  registerComponentWithStore(RecommendationsShowScreen)
  registerComponentWithStore(ScreeningsScreen)
  registerComponentWithStore(ScreeningsShowScreen)
  registerComponentWithStore(SubscriptionsScreen)
  registerComponentWithStore(SyncsList)
  registerComponentWithStore(SyncShow)
  registerComponentWithStore(RecentlyViewed)
  registerComponentWithStore(GenreModal)
  registerComponentWithStore(FilterModal)

  registerComponentWithoutStore(TopbarTrash)
  registerComponentWithoutStore(NavbarLogo)
  registerComponentWithoutStore(Spinner)
  registerComponentWithoutStore(SelectableTitle)
}

let currentStack: StackTypes = StackTypes.none


/**
 * Is not logged in routes
 */
export const goToAuth = (): void => {
  if (currentStack === StackTypes.auth) return

  currentStack = StackTypes.auth

  Navigation.setRoot({
    root: {
      ...authStack
    } as any
  })
}

let reAuthModalId

/**
 * Is logged in routes
 */
export const goToApp = (): void => {

  // close the reauth modal in case its a reauth not a swap
  if (reAuthModalId) {
    // hide the reauth model
    Navigation.dismissOverlay(reAuthModalId)

    // clear the id for dismissing
    reAuthModalId = null
  }

  // only change stack if we aren't there already
  if (currentStack === StackTypes.app) return

  // store the current stack
  currentStack = StackTypes.app

  // create the stack
  const stack = appStack()

  // set stack as root
  Navigation.setRoot(stack)

  // hide spinner
  hideSpinner()
}

export const reAuthenticate = async () => {
  // already open
  if (reAuthModalId) return

  reAuthModalId = await Navigation.showOverlay(authStack as any)
}

// Swap tabs
export const swapToHomeTab = async (componentId: string) => {
  return await Navigation.mergeOptions( componentId, { bottomTabs: { currentTabIndex: Tabs.home } } )
}

export const swapToSearchTab = async (componentId: string) => {
  return await Navigation.mergeOptions( componentId, { bottomTabs: { currentTabIndex: Tabs.search } } )
}

export const swapToDownloadTab = async (componentId: string) => {
  return await Navigation.mergeOptions( componentId, { bottomTabs: { currentTabIndex: Tabs.downloads } } )
}

export const swapToPrivateTab = async (componentId: string) => {
  return await Navigation.mergeOptions( componentId, { bottomTabs: { currentTabIndex: Tabs.profile } } )
}

// Pushing screens
export const pushProductShow = (componentId: string, productId: number, animated: boolean = true) => {

  Navigation.push(componentId, {
    component: {
      name: ProductShowScreen.componentName,
      passProps: {
        productId
      },
      options: {
        topBar: {
          title: {
            // text: type,
          },
        },
        animations: {
          push: {
            enabled: animated
          }
        }
      },
    },
  })
}

export const pushGenre = async (componentId: string, genreId: number) => {
  Navigation.push(componentId, {
    component: {
      name: GenreShowScreen.componentName,
      passProps: {
        genreId
      },
      options: {
        topBar: {
          // title: {
          //   component: {
          //     name: SelectableTitle.componentName,
          //     passProps:
          //   }
          // }
          // drawBehind: true,
          // background: {
          // translucent: true
          // },
          // visible: true,
        }
      },
    },
  })
}


export const pushGroup = async (componentId: string, groupId: number) => {
  Navigation.push(componentId, {
    component: {
      name: SyncShow.componentName,
      passProps: {
        groupId
      },
      options: {
        topBar: {

        }
      },
    },
  })
}

export const pushSettings = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: SettingsScreen.componentName,
    },
  })
}

export const pushFavorites = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: FavoritesScreen.componentName,
    },
  })
}

export const pushRecommendations = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: RecommendationsScreen.componentName,
    },
  })
}

export const pushScreenings = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: ScreeningsScreen.componentName,
    },
  })
}

export const pushRecentlyViewed = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: RecentlyViewed.componentName,
    },
  })
}

export const pushProfile = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: ProfileScreen.componentName,
    },
  })
}

export const pushScreeningsShow = async (componentId, screeningId) => {
  Navigation.push(componentId, {
    component: {
      name: ScreeningsShowScreen.componentName,
      passProps: {
        screeningId
      },
      options: {
        topBar: {
          title: {
            // text: type,
          },
        },
      },
    },
  })
}

export const pushSubscriptions = (componentId) => {
  Navigation.push(componentId, {
    component: {
      name: SubscriptionsScreen.componentName,
    },
  })
}

export const pushRecommendationsShow = async (componentId, recommendationId, index?) => {
  Navigation.push(componentId, {
    component: {
      name: RecommendationsShowScreen.componentName,
      passProps: {
        recommendationId,
        index
      },
      options: {
        topBar: {
          title: {
            // text: type,
          },
        },
      },
    },
  })
}

/**
 * Helper function for wrapping components with store
 * @param ComponentName
 * @param Component
 */
const registerComponentWithStore = (Component) => {
  Navigation.registerComponent(Component.componentName, () => (props) => (
    <Provider store={store}><Component {...props} /></Provider>
  ), () => Component)
}

/**
 * Helper function for wrapping components without store to match
 * @param ComponentName
 * @param Component
 */
const registerComponentWithoutStore = (Component) => {
  Navigation.registerComponent(Component.componentName, () => Component)
}
