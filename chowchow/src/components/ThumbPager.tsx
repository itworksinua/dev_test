import * as React from 'react'
import { View, ScrollView, TouchableOpacity, Dimensions, ViewStyle, Text, StyleSheet } from 'react-native'
import ThumborImage from './ThumborImage'
import { IAsset, IPreviewImage } from '../lib/interfaces'

import colors from 'chowchow/src/theme/colors'
import theme from 'chowchow/src/theme'

interface IThumbPagerProps extends React.Props<ThumbPager> {
  data: any[];
  selectedIndex?: number;
  thumbDimensions: any;
  margin: number;
  padding?: number;
  thumbStyle?: any;
  selectedThumbStyle?: any;
  containerStyle?: any;
  fillWithPlaceholders? : boolean;
  onPress: (index: any ) => void;
}

const ITEM_DETAIL_HEIGHT = 40
const styles = StyleSheet.create({
  container: {
    flexDirection: `column`,
  },
  title: {
    paddingLeft: 10,
    ...theme.ItemHeading,
    textTransform:`capitalize`
  },
  details: {
    justifyContent:`center`,
    backgroundColor: colors.SecondaryBackground,
    overflow: `hidden`,
  },
})

export default class ThumbPager extends React.Component<IThumbPagerProps>  {

  public static defaultProps = {
    padding: 0
  }

  private scrollView?: ScrollView|null = null

  public render() {
    const {
      data,
      thumbStyle,
      selectedThumbStyle,
      containerStyle,
      onPress,
      selectedIndex,
      thumbDimensions,
      margin,
      padding,
      fillWithPlaceholders
    } = this.props

    const detailsHeight = ITEM_DETAIL_HEIGHT
    const detailsStyle = {
      ...styles.details,
      height: detailsHeight
    }

    const windowWidth = Dimensions.get(`window`).width

    if (!data || !data.length || data.length <= 0) return null

    let scrollEnabled = true

    // Fill the width of the screen with placeholders
    if (fillWithPlaceholders) {

      const thumbWidth = thumbDimensions.width + (margin*2)
      const countToFill = Math.ceil(windowWidth / thumbWidth)
      const amountToFill = countToFill - data.length

      // add placeholders
      for (let i = 0; i < amountToFill; i++) data.push({ id: -1 })

      if (amountToFill > 0) scrollEnabled = false
    }

    // create tiles
    const tiles = data.map((videoItem, index) => {
      const image: IPreviewImage = videoItem.preview_image
      const style = (index === selectedIndex) ? selectedThumbStyle : thumbStyle

      const marginLeft = (index === 0) ? margin + padding : margin
      const marginRight = (index === data.length - 1) ? margin + padding : margin

      const completeStyle = {
        ...style,
        ...thumbDimensions,
        marginLeft,
        marginRight,
      }

      // is placeholder
      if (videoItem.id === -1) {
        return (
          <View key={index} style={completeStyle} />
        )
      }

      return (
        <View key={index} >
          <TouchableOpacity onPress={() => onPress({ position:index })}>
            <View style={styles.container}>
              <ThumborImage imageStyle={completeStyle} image={image} />
              {image && videoItem.title && <View style={{...detailsStyle, width: thumbDimensions.width, marginLeft, marginRight}}>
                <Text
                  style={styles.title}
                  numberOfLines={2}
                  ellipsizeMode={`tail`}
                >
                  {videoItem.title}
                </Text>
              </View>}
            </View>
          </TouchableOpacity>
        </View>
      )
    })

    const scrollViewStyle: ViewStyle = {
      justifyContent: `center`,
      alignItems: `center`,
      minWidth: windowWidth
    }

    return (
      <ScrollView
        ref = {comp => this.scrollView = comp}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollViewStyle}
        scrollEnabled={scrollEnabled}
      >
        <View style={containerStyle} >
          {tiles}
        </View>
      </ScrollView>
    )
  }

  public componentDidUpdate(prevProps: IThumbPagerProps) {
    if (this.scrollView && prevProps.selectedIndex !== this.props.selectedIndex) {
      const thumbWidth = this.props.thumbDimensions.width + (this.props.margin * 2)
      const screenWidth = Dimensions.get(`window`).width
      const halfScreenWidth = screenWidth / 2
      const totalWidth = thumbWidth * this.props.data.length + (this.props.padding * 2)

      if (totalWidth < screenWidth) {
        return
      }

      let x = (this.props.selectedIndex * thumbWidth) - halfScreenWidth + (thumbWidth/2) + this.props.padding

      if (x < 0 ) {
        this.scrollView.scrollTo({ x: 0 })
        return
      }

      const maxX = totalWidth - screenWidth

      if (x > maxX ) {
        this.scrollView.scrollTo({ x: maxX })
        return
      }

      this.scrollView.scrollTo({ x })
    }
  }

}
