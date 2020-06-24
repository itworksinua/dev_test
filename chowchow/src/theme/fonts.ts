import { Platform, TextStyle } from "react-native"

// we define available font weight and styles for each font here
const font = {
  SanFrancisco: {
    android: `sf-ui-display`,
    ios:`SF UI Display`,
    weights: {
      '900': `black`,
      '800': `heavy`,
      '700': `bold`,
      '600': `semibold`,
      '500': `medium`,
      '300': `thin`,
      '200': `light`,
      '100': `ultralight`,
    },
  },
  TopBar: {
    android: `sf-ui-display`,
    ios:`SFUIDisplay-Black`,
    weights: {
      '900': `black`,
      '800': `heavy`,
      '700': `bold`,
      '600': `semibold`,
      '500': `medium`,
      '300': `thin`,
      '200': `light`,
      '100': `ultralight`,
    },
  },
}

// eslint-disable-next-line
type FontWeightType = '100' | '200' | '300' | '500' | '600' | '700' | '800' | '900';

// generate styles for a font with given weight and style
export const fontMaker = (weight: FontWeightType, fontFamily: string = `SanFrancisco` ): TextStyle => {

  // get font
  const { weights, android, ios } = font[fontFamily]

  // android
  if (Platform.OS === `android`) {
    const suffix = weights[weight] ? `-${weights[weight]}` : ``

    return {
      fontFamily: android + suffix
    }
  }

  // ios
  return {
    fontFamily: ios,
    fontWeight: weight,
  }
  
}