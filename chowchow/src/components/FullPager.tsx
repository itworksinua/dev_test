import * as React from 'react'
import Button from "react-native-button"
import { View, StyleSheet, } from 'react-native'
import { ViewPager } from 'rn-viewpager'
import ThumborImage from './ThumborImage'
import { IAsset } from 'chowchow/src/lib/interfaces'
import playButton from "chowchow/assets/images/play-button.png"
import { Image } from 'react-native-elements'
import { showVideo } from '../navigation'

interface IFullPagerProps extends React.Props<FullPager> {
  data: IAsset[];
  selectedIndex: number;
  videoDimensions: any;
  goToIndex: (index: number) => void;
  containerStyle?: any;
  slideStyle?: any;
}

export default class FullPager extends React.Component<IFullPagerProps>  {

  private pagerRef?: ViewPager|null = null

  public constructor(props: IFullPagerProps){
    super(props)

    this.onPageSelected = this.onPageSelected.bind(this)
  }

  public render() {

    const slides = buildSlides(this.props.data, this.props.videoDimensions, this.props.selectedIndex)

    const containerStyle = {
      ...this.props.containerStyle,
      height: this.props.videoDimensions.height
    }

    return (
      <View style={containerStyle}>
        <ViewPager
          ref={comp => this.pagerRef = comp}
          onPageSelected={this.onPageSelected}
          style={{ height:this.props.videoDimensions.height }}
        >
          {slides}
        </ViewPager>
      </View>
    )
  }

  public componentDidUpdate(prevProps: IFullPagerProps) {
    if (this.pagerRef && prevProps.selectedIndex !== this.props.selectedIndex) {
      this.pagerRef.setPage(this.props.selectedIndex)
    }
  }

  private onPageSelected(e: any) {
    this.props.goToIndex(e)
  }

}

function buildSlides(assets: IAsset[], dimensions: any, selectedIndex: number) {

  const slideStyle = {
    justifyContent: `center`,
    alignItems: `center`,
  }

  return assets.map((asset: IAsset, i: number) => {

    const image = asset.preview_image

    if (!image) return null

    if (asset.type === `video`) {
      return (
        <View key={i}>
          <ThumborImage imageStyle={dimensions} image={image} />
          <View style={[styles.container, dimensions]}>
            <Button style={styles.button} onPress={() => showVideo(asset)}>
              <Image
                style={styles.icon}
                source={playButton}
                resizeMode="contain"/>
            </Button>
          </View>
        </View>
      )
    }

    return (
      <View
        key={i}
        style={[dimensions, slideStyle]}>
        <ThumborImage imageStyle={dimensions} image={image} resizeMode='contain'/>
      </View>
    )

  })
}

const styles = StyleSheet.create({
  container: {
    alignItems: `center`,
    justifyContent: `center`,
    position: `absolute`
  },
  button: {
    alignSelf: `center`
  },
  icon: {
    width: 60,
    height: 60,
    backgroundColor: `rgba(0,0,0,0.3)`,
    borderRadius: 30,
    // right: 30,
    // bottom: 30
  }
})

