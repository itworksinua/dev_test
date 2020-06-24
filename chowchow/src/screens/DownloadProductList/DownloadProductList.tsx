import * as React from "react"
import { observer, inject } from "mobx-react"
import { StyleSheet, View } from "react-native"

import { Navigation } from "react-native-navigation"
import { SwipeListView } from 'react-native-swipe-list-view'
import theme from "chowchow/src/theme"
import colors from "chowchow/src/theme/colors"
import DownloadProductListItem from "./DownloadProductListItem"
import DeleteButton from "chowchow/src/components/DeleteButton"
import DownloadStateView from "chowchow/src/components/DownloadStateView"
import DownloadProductShowScreen from "../DownloadProductShow"
import { get } from "lodash"
import { gutter } from "../../theme/theme"
import { IStore } from "../../store"

interface IDDownloadProductListProps extends React.Props<DownloadProductListScreen> {
  componentId: string;
  store: IStore;
}

interface IDownloadProductListState {
  isRefreshing: boolean;
}

@inject((store: any) => ({ ...store, }))

@observer
class DownloadProductListScreen extends React.Component<IDDownloadProductListProps, IDownloadProductListState> {

  public static componentName = `DownloadProductList`

  public state = {
    isRefreshing: false,
    downloads: []
  }

  public constructor(props) {
    super(props)

    this._renderHiddenItem = this._renderHiddenItem.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.onProductPress = this.onProductPress.bind(this)
    this.onDeleteProduct = this.onDeleteProduct.bind(this)
  }

  private _keyExtractor = (item) => `${item.id}`

  private _renderItem = (value: any) => {

    const { store: { download } } = this.props

    const product = value.item
    const children = get(product,`implicit_video_ids`,[])
    const videoCount = get(children,`length`, 0)
    const previewImage = get(product,`preview_image`)
    const total = download.getTotalSizeByAssetIds(children)

    return (
      <DownloadProductListItem
        id={product.id}
        type={product.type}
        title={product.display_title}
        videoCount={videoCount}
        totalSize={total}
        previewImage={previewImage}
        onPress={() => this.onProductPress(product)}
      />

    )

  }

  public render() {
    const { store: { download: { products } } } = this.props

    const data = products.filter(p => typeof p.parent_id !== `number`)

    const dataLength = get(data, `length`, 0)

    return (

      <SwipeListView
        useFlatList
        data={data}
        extraData={dataLength}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderHiddenItem={this._renderHiddenItem}
        ListHeaderComponent={this.getHeaderListComponent()}
        contentContainerStyle={theme.ContentContainerStyle}
        refreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
        ItemSeparatorComponent={this._renderSeparator}
        rightOpenValue={-80}
      />
      // </View>
    )
  }

  private getHeaderListComponent() {

    const state = this.props.store.download.getDownloadState()
    const used = this.props.store.download.getTotalSize()
    const free = this.props.store.download.freeSpace

    return (
      <DownloadStateView state={state} used={used} free={free}/>
    )
  }

  private _renderHiddenItem(data, rowMap) {

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

  private _renderSeparator() {

    const container = {
      height: gutter
    }

    return (
      <View style={container}>
      </View>
    )
  }

  private async onRefresh() {
    this.setState({ isRefreshing: true })

    await this.props.store.download.load()

    this.setState({ isRefreshing: false })
  }

  private async onProductPress(product) {

    Navigation.push(this.props.componentId, {
      component: {
        name: DownloadProductShowScreen.componentName,
        passProps: {
          productId: product.id,
          type: product.type
        },
        options: {
          topBar: {
            title: {
              text: product.title,
            },
            backButton: {
              title: ``
            }
          },
        },
      },
    })
  }

  public async componentDidMount(){
    await this.props.store.download.resumeIncomplete()
  }

  private onDeleteProduct(p){
    const { item } = p

    this.props.store.download.removeByProductId(item.id)
  }

}

export default DownloadProductListScreen
