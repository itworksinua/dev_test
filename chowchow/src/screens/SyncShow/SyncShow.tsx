import * as React from "react"
import { FlatList, ScrollView, View, Button, TouchableHighlight} from "react-native"
import { toJS } from 'mobx'
import { get } from 'lodash'
import { inject, observer } from 'mobx-react'
import { Navigation } from "react-native-navigation"
import { pushProductShow } from 'chowchow/src/navigation'
import ProductListItem from 'chowchow/src/components/ProductListItem'
import OrientationStore from "chowchow/src/store/orientationStore"
import groupStore from '../../store/groupStore'
import { IStore } from 'chowchow/src/store'
import colors from "chowchow/src/theme/colors"
import theme from "../../theme"
import styles from './styles'

interface ISyncShowScreenProps extends React.Props<SyncShowScreen> {
  componentId: string;
  groupId: number;
  group: groupStore;
  orientation: OrientationStore;
}

interface ISyncShowScreenState {
  selectedIndex: number;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { group, orientation } = store

  const res = {
    group,
    orientation,
  }

  return res
})

@observer
class SyncShowScreen extends React.Component<ISyncShowScreenProps, ISyncShowScreenState> {

  public static componentName = `SyncShowScreen`
  public state = { selectedIndex: 0 }

  public inputRefs: any

  public constructor(props: ISyncShowScreenProps) {
    super(props)

    this.pop = this.pop.bind(this)
    this.pushProduct = this.pushProduct.bind(this)
  }

  public componentDidMount() {
    const { group: {loadGroupProducts, loadGroupAssets} } = this.props

    if (this.props.groupId) {
      loadGroupProducts(this.props.groupId)
      loadGroupAssets(this.props.groupId)
    }
  }

  private renderProductItem = (value: any) => {
    const item = value.item
    const screenWidth = this.props.orientation.screenWidth
    const numColumns = this.props.orientation.numberOfListColumns

    const year = get(item, `default_layer.year_of_production`)
    const duration = get(item, `default_layer.duration`)

    return (
      <ProductListItem
        productId={item.id}
        onPressItem={id => this.pushProduct(id)}
        image ={item.preview_image}
        name={item.display_title}
        year={year}
        duration={duration}
        screenWidth={screenWidth}
        numColumns={numColumns}
      />
    )
  }

  private renderAssetItem = (value: any) => {
    const item = value.item
    const screenWidth = this.props.orientation.screenWidth
    const numColumns = this.props.orientation.numberOfListColumns

    const classification = get(item, `default_layer.classification`)
    const duration = get(item, `default_layer.duration`)

    return (
      <ProductListItem
        productId={item.id}
        onPressItem={id => console.log(id)}
        image ={item.preview_image}
        name={item.name}
        year={classification}
        duration={duration}
        screenWidth={screenWidth}
        numColumns={numColumns}
      />
    )
  }

  public render() {
    const buttons = ['Products', 'Assets']
    const {selectedIndex} = this.state
    const numColumns = this.props.orientation.numberOfListColumns
    const products = toJS(this.props.group.groupProducts)
    const assets = toJS(this.props.group.groupAssets)
    const data = selectedIndex === 0 ? products : assets
    const dataLength = get(data, `length`, 0)

    return(
      <ScrollView style={theme.Page}>
        <View style={styles.buttonContainer}>
          {buttons.map((b, index) => {
            return (
              <TouchableHighlight
               key={index}
               style={[styles.button, {borderRightWidth: index === 0 ? 3 : 0}]}>
                <Button onPress={() => this.updateIndex(index)}
                  title={b}
                  color={selectedIndex === index ? colors.Primary: 'white'}
                />
              </TouchableHighlight>
            )
          })}
        </View>

        <FlatList
          data={data}
          extraData={dataLength}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={this.keyExtractor}
          renderItem={selectedIndex === 0 ? this.renderProductItem : this.renderAssetItem}
          getItemLayout={this.getItemLayout}
        />
      </ScrollView>
    )
  }

  private keyExtractor = (item: any) => item.id.toString()

  private getItemLayout = (data: any, index: number) => ProductListItem.getItemLayout(index)

  private updateIndex(selectedIndex: number) {
    this.setState({selectedIndex})
  }

  private pushProduct(id: number) {
    pushProductShow(this.props.componentId, id, true)
  }

  private pop() {
    Navigation.pop(this.props.componentId)
  }
}

export default SyncShowScreen
