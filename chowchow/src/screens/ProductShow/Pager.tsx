import * as React from 'react'
import { View, Text, Dimensions } from 'react-native'
import FullPager from 'chowchow/src/components/FullPager'
import ThumbPager from 'chowchow/src/components/ThumbPager'
import DotPager from 'chowchow/src/components/DotPager'
import { getWpWithMax, getVideoDimensions } from 'chowchow/src/manager/screen'
import styles from './styles'
import { IAsset } from '../../lib/interfaces'

interface IPagerProps extends React.Props<Pager> {
  assets?: IAsset[];
}

const placeHolder: IAsset = {
  id: -1,
  name: ``,
  classification: ``
}

export default class Pager extends React.Component<IPagerProps>  {

  public state = {
    selectedIndex: 0,
  }

  public constructor(props) {
    super(props)

    this.goToIndex = this.goToIndex.bind(this)
  }

  public render() {

    const assets = (this.props.assets.length) ? this.props.assets : [placeHolder]
    const currentAsset = assets[this.state.selectedIndex] || placeHolder
    const title = currentAsset.name
    const type = currentAsset.classification && `(${currentAsset.classification.replace(/^(.*[\/])/g, '').replace(/_/g, ' ')})`
    const windowWidth = Dimensions.get(`window`).width
    const maxWidth = getWpWithMax(`100%`, windowWidth)
    const videoDimensions = getVideoDimensions(maxWidth)

    const thumbDimensions = {
      width: Math.round(videoDimensions.width/4),
      height: Math.round(videoDimensions.height/4),
    }

    return (
      <View>
        <FullPager
          data={assets}
          selectedIndex={this.state.selectedIndex}
          containerStyle={styles.videoBar}
          videoDimensions={videoDimensions}
          goToIndex={this.goToIndex}
        />

        <Text style={styles.label}>{title} {type}</Text>

        <ThumbPager
          data={assets}
          selectedIndex={this.state.selectedIndex}
          thumbStyle={styles.thumbStyle}
          selectedThumbStyle={styles.selectedThumbStyle}
          containerStyle={styles.thumbnailBar}
          thumbDimensions={thumbDimensions}
          margin={5}
          onPress={this.goToIndex}
        />

        <DotPager
          pageCount={assets.length}
          selectedIndex={this.state.selectedIndex}
          hideSingle={false}
        />
      </View>
    )
  }

  private goToIndex(e: any) {
    this.setState({ selectedIndex: e.position })
  }

}
