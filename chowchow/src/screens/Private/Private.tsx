import * as React from "react"
import { observer, inject } from "mobx-react"
import { View, FlatList } from "react-native"
import * as NavActions from '../../navigation'
import { IStore } from "../../store"
import { localize } from "../../locale"
import NetworkStore from "../../store/networkStore"
import SessionStore from "../../store/sessionStore"
import DownloadStore from "../../store/downloadStore"
import theme from "../../theme"
import PrivateItem from "./PrivateItem"
import FavoritesStore from "../../store/favoritesStore"

import { goToAuth } from 'chowchow/src/navigation'

interface IPrivateScreenProps extends React.Props<PrivateScreen> {
  componentId: string;
  network: NetworkStore;
  session: SessionStore;
  download: DownloadStore;
  favoritesStore: FavoritesStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { network, session, download, favoritesStore } = store

  const res = {
    network,
    session,
    download,
    favoritesStore
  }

  return res
})

@observer
class PrivateScreen extends React.Component<IPrivateScreenProps> {

  public static componentName = `PrivateScreen`

  public constructor(props: IPrivateScreenProps) {
    super(props)

    this.openDownloads = this.openDownloads.bind(this)
    this.openFavorites = this.openFavorites.bind(this)
    this.openRecommendations = this.openRecommendations.bind(this)
    this.openScreenings = this.openScreenings.bind(this)
    this.openSettings = this.openSettings.bind(this)
    this.openSubscriptions = this.openSubscriptions.bind(this)
    this.openProfile = this.openProfile.bind(this)
    this.openRecentlyViewed = this.openRecentlyViewed.bind(this)
    this.logout = this.logout.bind(this)
  }

  public componentWillMount() {
    this.props.session.loadStats()
  }

  public render() {
    const FirstName =  (this.props.session.session) ? this.props.session.session.user.first_name : `First`
    const LastName =  (this.props.session.session) ? this.props.session.session.user.last_name : `Last`
    const {stats: {recommendations, screenings, favorites, subscriptions, recentlyViewed}} = this.props.session

    let data

    if (this.props.network.connected) {
      data = [
        {
          title: `${FirstName} ${LastName}`,
        },
        {
          title: localize(`private:row:recommendations`),
          icon: `ios-list`,
          count: recommendations || 0,
          onPress: this.openRecommendations
        },
        {
          title: localize(`private:row:recentlyviewed`),
          icon: `ios-list`,
          count: recentlyViewed || 0,
          onPress: this.openRecentlyViewed
        },
        {
          title: localize(`private:row:screenings`),
          icon: `ios-tv`,
          count: screenings || 0,
          onPress: this.openScreenings
        },
        {
          title: localize(`private:row:favorites`),
          icon: `ios-star`,
          count: favorites,
          onPress: this.openFavorites
        },
        {
          title: localize(`private:row:subscriptions`),
          icon: `ios-checkmark-circle-outline`,
          count: subscriptions || 0,
          onPress: this.openSubscriptions
        },
        {
          title: localize(`private:row:profile`),
          icon: `ios-person`,
          onPress: this.openProfile
        },
        {
          title: localize(`private:row:settings`),
          icon: `ios-settings`,
          onPress: this.openSettings
        },
        {
          title: localize(`settings:title:logout`),
          icon: `ios-unlock`,
          onPress: this.logout
        },
      ]
    }
    else {
      data = [
        {
          title: `${FirstName} ${LastName}`,
        },
        {
          title: localize(`private:row:profile`),
          icon: `ios-person`,
          onPress: this.openProfile
        },
        {
          title: localize(`private:row:settings`),
          icon: `ios-settings`,
          onPress: this.openSettings
        },
        {
          title: localize(`settings:title:logout`),
          icon: `ios-unlock`,
          onPress: this.logout
        },
      ]
    }

    return (
      <View style={[theme.Page,]}>
        <FlatList
          renderItem={this.renderItem}
          data={data}
          keyExtractor={this.keyExtractor}
        />
      </View>
    )
  }

  private renderItem = ({ item }) => {

    return (
      <PrivateItem
        title={item.title}
        icon={item.icon}
        onPress={item.onPress}
        count={item.count}
      />
    )
  }

  private keyExtractor = (item, index) => item + index

  private openDownloads() {
    NavActions.swapToDownloadTab(this.props.componentId)
  }

  private openFavorites() {
    NavActions.pushFavorites(this.props.componentId)
  }

  private openRecommendations() {
    NavActions.pushRecommendations(this.props.componentId)
  }

  private openScreenings() {
    NavActions.pushScreenings(this.props.componentId)
  }

  private openSubscriptions() {
    NavActions.pushSubscriptions(this.props.componentId)
  }

  private openSettings() {
    NavActions.pushSettings(this.props.componentId)
  }

  private openRecentlyViewed() {
    NavActions.pushRecentlyViewed(this.props.componentId)
  }

  private openProfile() {
    NavActions.pushProfile(this.props.componentId)
  }

  private async logout() {
    await this.props.session.logout()
    goToAuth()
  }
}

export default PrivateScreen
