import * as React from 'react'
import { View, Text, ScrollView, ViewStyle } from 'react-native'
import { inject, observer } from 'mobx-react'
import { get, compact, find, toInteger } from 'lodash'
import theme from 'chowchow/src/theme'
import ProductShowStore from 'chowchow/src/store/productShowStore'
import chipmunk from 'chowchow/src/manager/chipmunk'

import { IStore } from 'chowchow/src/store'
import { ISlimProduct } from 'chowchow/src/lib/interfaces'
import Pager from './Pager'
import ShowMetaDetails from './ShowMetaDetails'
import ShowSeasons from './ShowSeasons'
import ShowVideos from './ShowVideos'
import FavoriteButton from './productFavorite'
import SubscriptionButton from './productSubscription'
import styles from './styles'
import { pushProductShow } from '../../navigation'
import CenterSpinner from '../../components/CenterSpinner'
import OfflineMode from "chowchow/src/components/OfflineMode"
import { gutter } from '../../theme/theme'
import { localize } from '../../locale'

interface IProductShowProps extends React.Props<ProductShowScreen> {
  productId: number;
  componentId: string;
  store: IStore;
}

@inject((store: any) => ({ ...store, }))

@observer
export default class ProductShowScreen extends React.Component<IProductShowProps> {

  public static componentName = `ProductShowScreen`

  public state = {
    favorite: {
      label: localize(`favorites:button:add`),
      icon: `ios-star-outline`,
      isFavorite: false
    },
    subscribe: {
      label: localize(`subscribe:button:add`),
      icon: `ios-checkmark-circle-outline`,
      isSubscribed: false
    },
  }

  private navigationEventListener?: any

  public constructor(props: IProductShowProps) {

    super(props)

    this.onPressSeason = this.onPressSeason.bind(this)
  }

  public async componentDidMount(): Promise<any> {

    const { productId } = this.props
    const {
      network: { connected },
      favoritesStore: { favorites },
      subscriptionsStore: { subscriptions },
      recentlyViewedStore,
      session,
    } = this.props.store

    this.productShowStore.getProductWithAssetsAndSeasons(productId)

    this.props.store.subscriptionsStore.load().then(() => {
      const isSubscribed = find(subscriptions, { id: toInteger(productId) } as any)

      if (isSubscribed && !this.state.subscribe.isSubscribed)
        this.setState({ subscribe: { icon: `ios-checkmark-circle`,
          label: localize(`subscribe:button:remove`),
          isSubscribed: true } })
    })

    const isFavorite = find(favorites, { id: toInteger(productId) } as any)

    if (isFavorite && !this.state.favorite.isFavorite)
      this.setState({ favorite: { icon: `ios-star`,
        label: localize(`favorites:button:remove`),
        isFavorite: true } })


    chipmunk.performLater(() => {
      if (connected) recentlyViewedStore.load()
    })

    session.loadStats()
  }

  public componentWillUnmount() {

    const { store, productId } = this.props

    store.destroyProductShowStore(productId)
  }

  /**
     * React
     */
  public render() {
    const { product, assets, seasons } = this.productShowStore
    const { session: { session } } = this.props.store
    const { network: { connected }} = this.props.store

    if (!connected && !product) return <OfflineMode />
    if (connected && !product) return <CenterSpinner />

    const videos = assets.filter(a => a.type === `video`)

    const type = product.type
    const year = get(product, `default_layer.year_of_production`)
    const duration = get(product, `default_layer.duration`)
    const synopsis = get(product, `default_layer.synopsis`)
    const casts = get(product, `default_layer.casts`, [])
    const crews = get(product, `default_layer.crews`, [])
    const country = get(product, `default_layer.country`)
    const formattedDuration = (duration) ? `${duration} mins`: null
    const meta = compact([year, formattedDuration, type]).join(` | `)

    const columns = this.props.store.orientation.numberOfContentColumns
    const percent = columns >= 2 ? 100/(columns + 1) : 100/columns
    const synopsisWidth = `${2*percent}`
    const colWidth = `${percent}%`
    const detailSectionStyle = {
      width: colWidth
    }

    const detailSectionContainerStyle: ViewStyle = {
      ...styles.detailsContainer,
      flexDirection: (columns <= 1) ? `column` : `row`,
    }

    const hasVideos = !!(videos.length && videos.length > 0)
    const hasSeasons = !!(seasons.length && seasons.length > 0)

    return (
      <View style={styles.container}>
        <ScrollView>

          <View style={styles.headingBar}>

            <View>
              <Text style={styles.heading}>{product.display_title}</Text>
              <Text style={styles.subHeading}>{meta}</Text>
            </View>

          </View>

          <Pager assets={assets}/>

          <View style={theme.HorizontalLine} />

          <View style={detailSectionContainerStyle}>

            <View style={detailSectionStyle}>
              <ShowMetaDetails
                country={country}
                year={year}
                casts={casts}
                crews={crews}
              />
            </View>

            <View style={columns >= 2 ? {width: synopsisWidth}: detailSectionStyle}>
              <Text style={[theme.Paragraph, styles.synopsis]}>{synopsis}</Text>
            </View>
          </View>

          <View style={[detailSectionStyle, styles.actionButtonContainer]}>
            <FavoriteButton productId={product.id} favorite={this.state.favorite} onUpdate={this.onUpdateFavorite}/>
            <SubscriptionButton productId={product.id} subscribe={this.state.subscribe} userId={session.user.id} onUpdate={this.onUpdateSubscription} />
          </View>

          {
            hasSeasons &&
            <View style={theme.HorizontalLine} />
          }

          {
            hasSeasons &&
            <ShowSeasons seasons={seasons} onPress={this.onPressSeason}/>
          }

          {
            hasVideos && <View style={theme.HorizontalLine} />
          }

          {
            hasVideos &&
            <ShowVideos productId={product.id} videos={videos} />
          }

        </ScrollView>
      </View>
    )
  }

  private onPressSeason = async (product: ISlimProduct) => {
    pushProductShow(this.props.componentId, product.id, true)
  }

  private onUpdateFavorite = async (favorite) => {
    const { favoritesStore, session } = this.props.store

    this.setState({ favorite }, async() => {
      await favoritesStore.load()
    })

    session.loadStats()
  }

  private onUpdateSubscription  = async (subscribe) => {
    const { subscriptionsStore, session } = this.props.store

    this.setState({ subscribe: subscribe }, async() => {
      await subscriptionsStore.load()
    })

    session.loadStats()
  }

  private get productShowStore(): ProductShowStore {
    const { store, productId } = this.props

    return store.getProductShowStore(productId)
  }

}
