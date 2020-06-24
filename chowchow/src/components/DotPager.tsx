import * as React from 'react'
// import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

const DEFAULT_DOT_RADIUS = 8

interface IDotPagerProps extends React.Props<DotPager> {
  pageCount: number;
  selectedIndex: number;
  dotStyle?: any;
  selectedDotStyle?: any;
  hideSingle: boolean;
}

export default class DotPager extends React.Component<IDotPagerProps>  {

  public render() {
    let { pageCount, dotStyle, selectedDotStyle, selectedIndex } = this.props

    if (pageCount <= 0)return null
    if (this.props.hideSingle && pageCount == 1) return null
    let dotsView = []

    for (let i = 0; i < pageCount; i++) {
      let isSelect = i === selectedIndex

      dotsView.push(
        <View
          style={[styles.dot, isSelect ? styles.selectDot : null, isSelect ? selectedDotStyle : dotStyle]}
          key={i}
        />
      )
    }

    return (
      <View style={styles.container} >
        {dotsView}
      </View>
    )
  }

}
const styles = StyleSheet.create({
  container: {
    // position: `absolute`,
    // bottom: 10,
    // left: 0,
    // right: 0,
    // backgroundColor: `red`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    // marginTop: 5,
    // marginBottom: 5,
  },
  dot: {
    width: DEFAULT_DOT_RADIUS,
    height: DEFAULT_DOT_RADIUS,
    margin: DEFAULT_DOT_RADIUS >> 1,
    borderRadius: DEFAULT_DOT_RADIUS >> 1,
    borderColor: `white`,
    borderWidth: 1,
    opacity: 0.5
  },
  selectDot: {
    backgroundColor: `white`
  }
})
