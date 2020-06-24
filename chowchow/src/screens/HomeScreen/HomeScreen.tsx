import { toJS } from 'mobx'
import { isEmpty, get, map, find, first } from 'lodash'
import { inject, observer } from 'mobx-react'
import React from "react"
import * as NavActions from '../../navigation'
import { ScrollView, Dimensions } from "react-native"
import { catPopulatedRoots } from "tuco/src/lib/helpers"

import HeroSlide from 'chowchow/src/components/HeroSlide'
import HeroPager from 'chowchow/src/components/HeroPager'
import DotPager from 'chowchow/src/components/DotPager'
import OfflineMode from "chowchow/src/components/OfflineMode"
import HomeSection from './HomeSection'

import { pushProductShow, pushGenre } from '../../navigation'
import { getWpWithMax, getVideoDimensions } from 'chowchow/src/manager/screen'
import styles from './styles'

import { IStore } from 'chowchow/src/store'
import { hasPropChanged } from 'chowchow/src/lib/helpers'
import theme from '../../theme'
import { localize } from '../../locale'
import CenterSpinner from '../../components/CenterSpinner'

interface IHomeScreenProps extends React.Props<HomeScreen> {
  store: IStore;
  componentId: string;
}

@inject((store: any) => ({ ...store, }))
@observer
export default class HomeScreen extends React.Component<IHomeScreenProps> {

  public state = {
    heroIndex: 0,
    categoryIndex: 0,
    viewedIndex: 0,
  }

  public static componentName = `HomeScreen`

  public constructor(props: IHomeScreenProps) {
    super(props)
    if (this.props.store.network.connected) this.load()
  }

  public componentDidUpdate(prev) {
    if (!hasPropChanged(prev, this.props, 'store.network.connected')) return
    if (this.props.store.network.connected) this.load()
  }

  public render() {
    let {
      homeStore: { heroItems, productsByCategory },
      recentlyViewedStore: { products: recentlyViewedProducts },
      basicsStore: { categories },
      favoritesStore: { favorites },
      network: { connected },
    } = this.props.store

    if (!connected) return <OfflineMode />
    if (!productsByCategory) return <CenterSpinner />

    const windowWidth = Dimensions.get(`window`).width
    const maxWidth = getWpWithMax(`100%`, windowWidth)
    const videoDimensions = getVideoDimensions(maxWidth)
    const heroSlide = {
      width: videoDimensions.width,
      height: videoDimensions.height,
    }

    const heroSlideStyle = {
      ...heroSlide,
      width: this.props.store.orientation.screenWidth
    }

    const heroSlides = buildSlides(heroItems,categories,heroSlideStyle, id => this.goToProduct(id))

    recentlyViewedProducts = toJS(recentlyViewedProducts)
    productsByCategory = toJS(productsByCategory)
    favorites = toJS(favorites)

    const numColumns = this.props.store.orientation.numberOfListColumns

    const dimensions = {
      width: Math.round(videoDimensions.width/numColumns),
      height: Math.round(videoDimensions.height/numColumns),
    }

    return(
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        style={theme.Page}
      >

        <HeroPager
          containerStyle={heroSlide}
          selectedIndex={this.state.heroIndex}
          goToIndex={e => this.setState({ heroIndex :e.position })}
        >
          {heroSlides}
        </HeroPager>

        <DotPager pageCount={heroSlides.length} selectedIndex={this.state.heroIndex} hideSingle={true} />

        {productsByCategory && map(productsByCategory, (products, categoryName) => {

          return (
            <HomeSection
              key={categoryName}
              title={categoryName}
              data={products}
              sliderStyle={styles.slider}
              titleStyle={styles.title}
              thumbStyle={styles.thumbStyle}
              thumbnailBarStyle={styles.thumbnailBar}
              dimensions={dimensions}
              titlePressed={() => this.goToGenreByName(categoryName)}
              itemPressed={(p) => this.goToProduct(p)}
            />)
        })}

        <HomeSection
          key={`favs`}
          title={localize(`home:title:favorites`)}
          data={favorites}
          sliderStyle={styles.slider}
          titleStyle={styles.title}
          thumbStyle={styles.thumbStyle}
          thumbnailBarStyle={styles.thumbnailBar}
          dimensions={dimensions}
          titlePressed={() => this.openFavorites()}
          itemPressed={(p) => this.goToProduct(p)}
        />

        <HomeSection
          key={`rec-view`}
          title={localize(`home:title:recentlyviewed`)}
          data={recentlyViewedProducts}
          sliderStyle={styles.slider}
          titleStyle={styles.title}
          thumbStyle={styles.thumbStyle}
          thumbnailBarStyle={styles.thumbnailBar}
          dimensions={dimensions}
          titlePressed={() => this.openRecentlyViewed()}
          itemPressed={(p) => this.goToProduct(p)}
        />

      </ScrollView>
    )
  }

  private load() {
    const { homeStore, basicsStore, favoritesStore, recentlyViewedStore } = this.props.store

    basicsStore.loadBasics().then(async () => {
      let categories = toJS(basicsStore.categories) as any[]
      categories = catPopulatedRoots(categories)

      homeStore.loadProducts(categories)
    })

    homeStore.loadHeroSlider()
    favoritesStore.load()
    recentlyViewedStore.load()
  }

  private goToGenreByName(categoryName) {
    const { categories } = this.props.store.basicsStore
    const currentCategory = find(categories, { name: categoryName })

    pushGenre(this.props.componentId, currentCategory.id)
  }

  private goToProduct(product) {

    pushProductShow(this.props.componentId, product.id, true)
  }

  private openRecentlyViewed() {
    NavActions.pushRecentlyViewed(this.props.componentId)
  }

  private openFavorites() {
    NavActions.pushFavorites(this.props.componentId)
  }

}

const buildSlides = (heroItems, categories, heroSlideStyle, onPress) => {
  return heroItems.map((item, i) => {
    const {  product } = item
    const categoryIds = get(product, `default_layer.category_ids`) || []

    let category
    if (!isEmpty(categoryIds)) {
      category = find(categories, {id: first(categoryIds)})
    }

    return (
      <HeroSlide
        index={i}
        key={i}
        product={product}
        category={category}
        containerStyle={heroSlideStyle}
        onPress={onPress}/>
    )
  })
}
