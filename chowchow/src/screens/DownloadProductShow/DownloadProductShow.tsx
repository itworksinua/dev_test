import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { inject, observer } from 'mobx-react'
import { filter, map, } from 'lodash'
import theme from 'chowchow/src/theme'
import { IStore } from 'chowchow/src/store'
import DownloadProductShowItem from './DownloadProductShowItem'
import { pushProductShow } from '../../navigation'
import { Navigation } from 'react-native-navigation'
import { IFullProduct } from '../../lib/interfaces'
import colors from '../../theme/colors'
import Icon from "react-native-vector-icons/Ionicons"
import DownloadStateView from '../../components/DownloadStateView'
import DeleteButton from '../../components/DeleteButton'

interface IDownloadProductShowProps extends React.Props<DownloadProductShowScreen> {
  productId: number;
  componentId: string;
  type: string;
  store: IStore;
}

@inject((store: any) => ({ ...store, }))

@observer
export default class DownloadProductShowScreen extends React.Component<IDownloadProductShowProps> {

  public static componentName = `DownloadProductShowScreen`

  public constructor(props) {
    super(props)

    this.onProductPress = this.onProductPress.bind(this)
    this.onDeleteProduct = this.onDeleteProduct.bind(this)
    this.getHeaderListComponent = this.getHeaderListComponent.bind(this)

    this._renderHiddenItem = this._renderHiddenItem.bind(this)
    this.onDeleteProduct = this.onDeleteProduct.bind(this)
  }

  private renderItem({ item, index, section }) {
    const asset = item

    return (
      <DownloadProductShowItem key={index.toString()} asset={asset} />
    )
  }

  private renderSectionHeader = ({ section }) => {
    return (
      <TouchableOpacity onPress={() => this.onProductPress(section.product)}>
        <View style={theme.DownloadSectionHeader}>
          <Text style={theme.DownloadSectionHeading}>{section.product.display_title}</Text>
          <Icon name={`ios-arrow-forward`} size={15} color={colors.Primary}/>
        </View>
      </TouchableOpacity>
    )
  }

  public render() {
    const { store: { download: downloadStore }, productId } = this.props
    const { assets } = downloadStore

    const allRelatedProducts = this.props.store.download.getAllRelatedProductsForProductId(productId)

    if (!allRelatedProducts.length) {
      Navigation.pop(this.props.componentId)
      return null
    }

    const sections = map(allRelatedProducts, (p) => {
      return {
        product: p,
        data: filter(assets, { product_id: p.id }),
      }
    })

    return (
      <SwipeListView
        useSectionList
        sections={sections}
        extraData={sections.length}
        renderItem={this.renderItem}
        renderHiddenItem={this._renderHiddenItem}
        renderSectionHeader={this.renderSectionHeader}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={this.getHeaderListComponent}
        rightOpenValue={-80}
      />
    )
  }

  private keyExtractor(item, index) {

    const key = `${item.id}.${index}`

    return key
  }

  private getHeaderListComponent() {
    const assets = this.props.store.download.getAllRelatedAssetsForProductId(this.props.productId)
    const state = this.props.store.download.getDownloadState(assets)
    const used = this.props.store.download.getTotalSize(assets)
    const free = this.props.store.download.freeSpace

    return (
      <DownloadStateView state={state} used={used} free={free}/>
    )
  }

  private _renderHiddenItem(data,) {

    const styles = StyleSheet.create({
      container: {
        backgroundColor: colors.Error,
        flex: 1,
        alignItems: `center`,
        flexDirection: `row`,
        justifyContent: `flex-end` ,
      }
    })

    return (
      <View style={styles.container}>
        <DeleteButton color={`#FFFFFF`} onClick={() => this.onDeleteProduct(data)}/>
      </View>
    )
  }

  private onProductPress = async (product: IFullProduct) => {

    pushProductShow(this.props.componentId, product.id)
  };

  private onDeleteProduct(p){
    const { item } = p

    this.props.store.download.remove(item.id)
  }

}
