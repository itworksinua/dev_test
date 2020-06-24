import React from "react"
import { observer, inject } from "mobx-react"
import { FlatList, RefreshControl, SafeAreaView, } from "react-native"
import { get } from "lodash"
import { Navigation } from "react-native-navigation"
import ProductListItem from 'chowchow/src/components/ProductListItem'
import EmptyList from "chowchow/src/components/EmptyList"
import theme from "chowchow/src/theme"
import SearchTopBar from "chowchow/src/components/SearchTopBar"
import colors from "chowchow/src/theme/colors"
import { localize } from "chowchow/src/locale"
import { IStore } from "chowchow/src/store"
import { ISlimProduct } from 'chowchow/src/lib/interfaces'
import ProductShow from "chowchow/src/screens/ProductShow"
import { showFilter } from "../../navigation"
import CenterSpinner from "../../components/CenterSpinner"
import { hasPropChanged } from 'chowchow/src/lib/helpers'

interface ISearchListScreenProps extends React.Props<SearchListScreen> {
  componentId: string;
  store: IStore;
}

@inject((store: any) => ({ ...store, }))
@observer
export default class SearchListScreen extends React.Component<ISearchListScreenProps, any> {
  private navigationEventListener
  private connected = false

  public static componentName = `SearchList`

  public constructor(props: ISearchListScreenProps) {
    super(props)

    // workaround, since obviously this component
    // does not get all updates on network changes
    this.connected = props.store.network.connected

    this.load = this.load.bind(this)
    this.onPressItem = this.onPressItem.bind(this)
    this.onEndReached = this.onEndReached.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)

    this.load()
  }

  public async componentDidMount(): Promise<void> {
    this.navigationEventListener = Navigation.events().bindComponent(this)
  }

  public componentDidUpdate(prev) {
    if (hasPropChanged(this, this.props.store.network, 'connected')) {
      this.connected = this.props.store.network.connected
      this.load()
    }
  }

  public componentWillUnmount() {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove()
    }
  }

  public navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case `show-filter-btn`:
        showFilter()
        break
    }
  }
  private renderItem = (value: any) => {
    const product = value.item
    const screenWidth = this.props.store.orientation.screenWidth
    const numColumns = this.props.store.orientation.numberOfListColumns

    const year = get(product, `default_layer.year_of_production`)
    const duration = get(product, `default_layer.duration`)

    return <ProductListItem
      productId={product.id}
      name={product.display_title}
      image={product.preview_image}
      duration={duration}
      year={year}
      onPressItem={this.onPressItem}
      screenWidth={screenWidth}
      numColumns={numColumns}
    />
  }

  public render() {
    const numColumns = this.props.store.orientation.numberOfListColumns

    const { store: { network: { connected }, productList: { loading, products } } } = this.props

    const dataLength = get(products.objects, `length`, 0)

    return (

      <SafeAreaView style={theme.Page}>
        <FlatList
          data={products.objects}
          extraData={dataLength}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={theme.ContentContainerStyle}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          refreshing={loading}
          onEndReached={this.onEndReached}
          ListEmptyComponent={ this.getEmptyListComponent()}
          ListHeaderComponent={this.getHeaderListComponent()}
          refreshControl={this.getRefreshComponent()}
        />
      </SafeAreaView>
    )
  }

  private getRefreshComponent(): React.ComponentElement<null,any> {
    const { store: { productList: { loading } } } = this.props

    return (
      <RefreshControl
        onRefresh= {this.load}
        refreshing={loading}
        tintColor={colors.Primary}
        style={{ backgroundColor: colors.TopBar }}
      />
    )
  }

  private getHeaderListComponent(): React.ComponentElement<null,any> {
    return (
      <SearchTopBar
        search={this.props.store.productList.search}
        onSearchChange={this.onSearchChange}
      />
    )
  }
  private getEmptyListComponent(): React.ComponentElement<null,any> {

    const { search, loading } = this.props.store.productList

    if (loading) return <CenterSpinner />

    const title = (search === ``)
      ? localize(`productlist:empty:title`)
      : localize(`productlist:no_results:title`)

    const subtitle = (search === ``)
      ? localize(`productlist:empty:subtitle`)
      : localize(`productlist:no_results:subtitle`)

    return (
      <EmptyList
        title={title}
        subtitle={subtitle}
      />
    )
  }

  private keyExtractor = (item: ISlimProduct) => item.id.toString()

  private getItemLayout = (data: any, index: number) => ProductListItem.getItemLayout(index)

  private onPressItem = async (productId: number) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: ProductShow.componentName,
        passProps: {
          productId: productId
        },
        options: {
          topBar: {
            title: {
              // text: capitalize(`Product`),
            },
          },
        },
      },
    })
  };

  private async load() {
    await this.props.store.productList.startLoading()
  }

  private onEndReached() {
    this.props.store.productList.loadMore()
  }

  private async onSearchChange(term) {
    await this.props.store.productList.startSearch(term)
  }

}
