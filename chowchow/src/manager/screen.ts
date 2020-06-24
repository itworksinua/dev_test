import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as addOrientationListener,
  removeOrientationListener
} from 'react-native-responsive-screen'
import { Platform, PixelRatio, Dimensions } from 'react-native'

const getWpWithMax = (percent: string, max: number) => {
  if (wp(percent) > max) return max
  return wp(percent)
}

const getVideoDimensions = (screenWidth: number, itemMargin: number = 0, numColumns: number = 1) => {
  const totalGutters = (numColumns + 1) * itemMargin / 2
  const width = (screenWidth - totalGutters) / numColumns
  const height = Math.ceil((width/16)*9)

  return {
    width,
    height
  }
}

const d = Dimensions.get(`window`)
const sWidth = (d.width < d.height) ? d.width : d.height
const scale = sWidth / 320 // based on iphone 5s's scale

function normalize(size) {
  const newSize = size * (scale * 0.9)

  if (Platform.OS === `ios`) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export {
  wp,
  hp,
  addOrientationListener,
  removeOrientationListener,
  getWpWithMax,
  getVideoDimensions,
  normalize
}
