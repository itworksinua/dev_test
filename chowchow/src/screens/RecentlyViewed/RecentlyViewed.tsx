import * as React from "react"
import { observer, inject } from "mobx-react"
import { get, capitalize } from "lodash"
import { Navigation } from "react-native-navigation"
import { FlatList, RefreshControl, SafeAreaView, } from "react-native"
import { IStore } from "chowchow/src/store"
import ProductShow from "chowchow/src/screens/ProductShow"
import ProductListItem from 'chowchow/src/components/ProductListItem'
import EmptyList from "chowchow/src/components/EmptyList"
import RecentlyViewedStore from 'chowchow/src/store/recentlyViewedStore'
import OrientationStore from "chowchow/src/store/orientationStore"
import theme from "chowchow/src/theme"
import colors from "chowchow/src/theme/colors"
import { localize } from "../../locale"

interface IRecentlyViewedProps extends React.Props<RecentlyViewed> {
  componentId: string;
  recentlyViewedStore: RecentlyViewedStore;
  orientation: OrientationStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { recentlyViewedStore, orientation } = store

  const res = {
    recentlyViewedStore,
    orientation,
  }

  return res
})

@observer
export default class RecentlyViewed extends React.Component<IRecentlyViewedProps> {

  public static componentName = `RecentlyViewed`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`recently_viewed:title`)
        },
      }
    }
  }

  public constructor(props: IRecentlyViewedProps) {
    super(props)

    this.props.recentlyViewedStore.load()
  }

  public render() {
    const numColumns = this.props.orientation.numberOfListColumns

    const { recentlyViewedStore: { products } } = this.props

    const dataLength = get(products, `length`, 0)

    return (
      <SafeAreaView style={theme.Page}>
        <FlatList
          data={products}
          extraData={dataLength}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={theme.ContentContainerStyle}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    )
  }

  private renderItem = (value: any) => {
    const product = value.item
    const screenWidth = this.props.orientation.screenWidth
    const numColumns = this.props.orientation.numberOfListColumns

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
              text: capitalize(`Product`),
            },
          },
        },
      },
    })
  };

}
