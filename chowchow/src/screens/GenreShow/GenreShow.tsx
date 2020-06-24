import * as React from "react"
import { View, FlatList, ScrollView, } from "react-native"
import { toJS } from 'mobx'
// import { Button } from 'react-native-elements'
import { find, get, isArray, toInteger, filter } from 'lodash'
import { inject, observer } from 'mobx-react'
import { Navigation } from "react-native-navigation"
// import Icon from "react-native-vector-icons/Ionicons"
import { showGenreModal, pushProductShow } from 'chowchow/src/navigation'
import { catDescendantIds, catChildren } from "tuco/src/lib/helpers"
import ProductListItem from 'chowchow/src/components/ProductListItem'
import OrientationStore from "chowchow/src/store/orientationStore"
import GenreStore from "chowchow/src/store/genreStore"
import HeroSlider from 'chowchow/src/components/HeroSlider'
import TextPager from 'chowchow/src/components/TextPager'
import { IStore } from 'chowchow/src/store'
import theme from "../../theme"
import styles from './styles'
import SelectableTitle from "../../components/SelectableTitle"

interface IGenreShowProps extends React.Props<GenreShowScreen> {
  componentId: string;
  genreId: number;
  store: IStore;
  orientation: OrientationStore;
}

@inject((store: any) => ({ ...store, }))
@observer
export default class GenreShowScreen extends React.Component<IGenreShowProps> {

  public state = {
    genreId: null,
    selectedCat: null,
    numbers: [
      {
        label: `1`,
        value: 1,
        color: `orange`,
      },
      {
        label: `2`,
        value: 2,
        color: `green`,
      },
    ],
    selectedGenre: undefined,
    favSport1: undefined,

  }

  public static componentName = `GenreShowScreen`

  public inputRefs: any

  public constructor(props: IGenreShowProps) {
    super(props)
    const { basicsStore } = props.store

    this.genreStore.getHeroProducts(props.genreId)
    basicsStore.loadBasics()

    this.inputRefs = {
      firstTextInput: null,
      selectedGenre: null,
      favSport1: null,
      lastTextInput: null,
    }

    this.state.genreId = props.genreId

    this.pop = this.pop.bind(this)
    this.pushProduct = this.pushProduct.bind(this)
    this.openGenreModal = this.openGenreModal.bind(this)
    this.getHeaderComponent = this.getHeaderComponent.bind(this)
    this.subcatSelected = this.subcatSelected.bind(this)
  }

  public componentDidMount() {
    const { basicsStore: { categories } } = this.props.store
    const currentCategory = find(categories, { id: this.state.genreId })
    const descendantIds = currentCategory ? catDescendantIds(categories, currentCategory) : this.state.genreId

    this.genreStore.filterProductsByCategory(descendantIds)

    if(this.state.genreId && !this.state.selectedGenre) {
      this.setState({ selectedGenre: this.state.genreId })
      this.setTitle(  this.state.genreId )
    }
  }

  private renderItem = (value: any) => {
    const product = value.item
    const screenWidth = this.props.store.orientation.screenWidth
    const numColumns = this.props.store.orientation.numberOfListColumns

    const year = get(product, `default_layer.year_of_production`)
    const duration = get(product, `default_layer.duration`)

    return (
      <ProductListItem
        productId={product.id}
        onPressItem={id => this.pushProduct(id)}
        image ={product.preview_image}
        name={product.display_title}
        year={year}
        duration={duration}
        screenWidth={screenWidth}
        numColumns={numColumns}
      />
    )
  }

  public render() {
    const numColumns = this.props.store.orientation.numberOfListColumns
    const categories = toJS(this.props.store.basicsStore.categories)
    const { genreProducts } = this.genreStore
    const currentCategory = find(categories, { id: toInteger(this.state.genreId) })
    const currentCategoryName = get(currentCategory, `name`, ``)
    const { heroProducts } = this.genreStore
    const dataLength = get(genreProducts.objects, `length`, 0)

    let subCategories = catChildren(categories, currentCategory)
    subCategories = filter(subCategories, x => x.products_count > 0)

    return(
      <ScrollView style={theme.Page}>

        { this.getHeaderComponent(heroProducts, currentCategoryName)}
        { this.getSubCategorySlider(subCategories)}
        <FlatList
          data={genreProducts.objects}
          extraData={dataLength}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          // ListHeaderComponent={() => this.getHeaderComponent(heroProducts, currentCategoryName, subCategories)}
          // contentInsetAdjustmentBehavior="never"s

        />
      </ScrollView>
    )
  }

  private keyExtractor = (item) => item.id.toString()

  private getHeaderComponent = (heroProducts, category) => {

    if (!heroProducts.length) return null

    const width = this.props.store.orientation.screenWidth

    return (
      <View>
        <HeroSlider
          products={heroProducts}
          onPress={id => this.pushProduct(id)}
          height={300}
          width={width}
        />

      </View>
    )
  }

  private getSubCategorySlider = (subCategories) => {
    const { selectedCat } = this.state
    const allOption = { name: 'All', id: null }

    const data = [allOption, ...subCategories]

    return (
      <View style={styles.subGenres}>
        {
          <TextPager
            data={data}
            selectedItem={this.state.selectedCat || allOption}
            labelStyle={styles.listStyle}
            selectedLabelStyle={{}}
            onPress={(cat) => this.subcatSelected(cat)}
          />
        }
      </View>
    )

  }

  private subcatSelected = (cat) => {
    if (this.state.selectedCat === cat) return

    this.setState({ selectedCat: cat })
    this.filterProducts(cat)
  }

  private getItemLayout = (data: any, index: number) => ProductListItem.getItemLayout(index)

  private pushProduct(id) {
    pushProductShow(this.props.componentId, id, true)
  }

  private get genreStore(): GenreStore {
    const { store, genreId } = this.props

    return store.getGenreStore(genreId)
  }

  private filterProducts(cat) {
    const { basicsStore: { categories } } = this.props.store
    const currentCategory = find(categories, { id: this.state.genreId })

    const categoryIds = get(cat, 'name') === 'All' ?
      catDescendantIds(categories, currentCategory) :
      catDescendantIds(categories, cat)

    this.genreStore.filterProductsByCategory(categoryIds)
  }

  private openGenreModal() {
    const { basicsStore: { categories } } = this.props.store

    // pass only the main categories
    const cats = filter(categories, (c) => !c.parent_id)
    showGenreModal(this.props.componentId, cats, (genreId) => {
      this.setState({ genreId })
      this.setTitle(genreId)
    })
  }

  private pop() {
    Navigation.pop(this.props.componentId)
  }

  private setTitle(genreId: number) {

    const {
      basicsStore: {
        categories
      }
    } = this.props.store
    const currentCategory = find(categories, { id: genreId })
    const currentCategoryName = get(currentCategory, `name`, ``)

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          component: {
            name: SelectableTitle.componentName,
            passProps: {
              title: currentCategoryName,
              onPress: () =>  this.openGenreModal()
            }
          }
        }
      }
      // drawBehind: true,
      // background: {
      //   translucent: true
      // },
      // visible: true,
    })
  }

}
