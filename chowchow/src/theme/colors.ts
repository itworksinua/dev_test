import { TextInput } from "react-native"

const colors = Object.freeze({
  Primary: `#C2192A`,
  Secondary: `#323338`,
  Success: `#39b54a`,
  Error: `#f85359`,
  Info: `#1da1f2`,
  TopBar: `#121216`,
  Background: `#191A1E`,
  SecondaryBackground: `#27282e`,
  Heading: `#FFFFFF`,
  Text: `#D1D1D2`,
  TextGrey: `#D1D1D2`,
  TextMuted: `#606166`,
  InputBorder: `#606166`,
  InputPlaceholder: `#606166`,
  ImagePlaceholder: `#292B32`,
  Tab:`#606166`,
  SelectedTab:`#FFFFFF`,
  SpinnerBackground: `rgba(0,0,0,0.8)`,
  Badge: `#323339`,
  BadgeText: `#a5a7af`,
  Icon: `#535458`,
  Hairline: `#ccc`,
  SliderSelected:`#D1D1D2`,
  SliderUnselected: `#333`,
  ActivityIndicator: `#D1D1D2`,

  orange: `#1fdfd8`,
  blue:`#7ed321`,
  green: `#ffa51b`,
  white: `#fff`
})

export default colors

TextInput['defaultProps'].selectionColor = colors.Primary
