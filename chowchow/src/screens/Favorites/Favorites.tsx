import * as React from "react"
import { get } from "lodash"
import { observer, inject } from "mobx-react"
import { FlatList, SafeAreaView } from "react-native"
import { localize } from "chowchow/src/locale"
import { IStore } from "chowchow/src/store"
import FavoritesEmpty from './FavoritesEmpty'
import theme from "chowchow/src/theme"
import ProductListItem from "chowchow/src/components/ProductListItem"
import { pushProductShow } from "../../navigation"

interface FavoritesProps {
  store: IStore;
  componentId: string;
}

const Favorites = (props: FavoritesProps) => {

  const { store, componentId } = props
  const { favoritesStore, orientation } = store
  const data = favoritesStore.favorites
  const numColumns = orientation.numberOfListColumns

  return (
    <SafeAreaView style={theme.Page}>
      <FlatList
        data={data}
        key={numColumns}
        numColumns={numColumns}
        renderItem={(item) => renderItem(item, orientation, componentId)}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={theme.ContentContainerStyle}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  )
}

Favorites.componentName = `Favorites`

Favorites.options = () => {
  return {
    topBar: {
      title: {
        text: localize(`favorites:title`)
      },
    }
  }
}

const renderItem = ({ item }, orientation, componentId) => {

  const product = item

  const year = get(product, `default_layer.year_of_production`)
  const duration = get(product, `default_layer.duration`)

  return <ProductListItem
    productId={product.id}
    name={product.display_title}
    image={product.preview_image}
    duration={duration}
    year={year}
    onPressItem={(id) => onPressItem(id, componentId)}
    screenWidth={orientation.screenWidth}
    numColumns={orientation.numberOfListColumns}
  />
}

const onPressItem = (id: number, componentId: string) => pushProductShow(componentId, id)

const renderEmpty = () => <FavoritesEmpty />

const getItemLayout = (data: any, index: number) => ProductListItem.getItemLayout(index)

export default inject(`store`)(observer(Favorites))
