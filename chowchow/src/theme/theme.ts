import { StyleSheet, PixelRatio } from "react-native"
import colors from './colors'
import { fontMaker } from "./fonts"
import { normalize } from "react-native-elements"

export const gutter = 10
export const downloadIconSize = 25
export const downloadCheckmarkIconSize = 35
export const downloadDeleteIconTop =  1
export const hairline = 1 / PixelRatio.get()

export default StyleSheet.create({
  PageTitle: {
    ...fontMaker(`900`, `TopBar`),
    fontSize: normalize(15),
    color: colors.Heading,
  },
  Page: {
    flex: 1,
    backgroundColor: colors.Background,
  },
  PageCenterContent: {
    alignItems: `center`,
    justifyContent: `center` ,
    flex: 1,
  },
  SpinnerContainer: {
    flex: 1,
    backgroundColor: colors.SpinnerBackground,
  },
  ContentContainerStyle: {
    flexGrow: 1,
  },
  EmptyContentContainerStyle: {
    flexGrow: 1,
    alignItems: `center`,
    justifyContent: `center` ,
  },
  Logo: {
    width: 250,
    height: 100,
    marginTop: 0,
    marginRight: `auto`,
    marginBottom: 0,
    marginLeft: `auto`,
  },
  HeroTitle: {
    ...fontMaker(`900`),
    fontSize: normalize(24),
    color: colors.Heading,
    textAlign: `left`,
  },
  HeroSubtitle: {
    ...fontMaker(`500`),
    fontSize: normalize(14),
    color: colors.TextMuted,
    textAlign: `left`,
  },
  HeroCategory: {
    ...fontMaker(`500`),
    fontSize: normalize(14),
    color: colors.white,
    textAlign: `left`,
  },
  Heading: {
    ...fontMaker(`900`),
    fontSize: normalize(21),
    color: colors.Heading,
    textAlign: `center`,
  },
  HeadingTwo: {
    ...fontMaker(`500`),
    fontSize: normalize(18),
    color: colors.Heading,
    textAlign: `center`,
  },
  SmallHeading: {
    ...fontMaker(`500`),
    fontSize: normalize(13),
    color: colors.Heading,
    textAlign: `center`,
  },
  SubHeading: {
    ...fontMaker(`500`),
    fontSize: normalize(15),
    color: colors.TextMuted,
    textAlign: `center`,
  },
  ItemHeading: {
    ...fontMaker(`700`),
    fontSize: normalize(13),
    color: colors.Heading,
  },
  Paragraph: {
    ...fontMaker(`300`),
    fontSize: normalize(12),
    color: colors.TextGrey,
    textAlign: `left`,
  },
  MetaHeading: {
    ...fontMaker(`700`),
    fontSize: normalize(11),
    color: colors.Primary,
    marginTop: 10,
  },
  MetaDetail: {
    ...fontMaker(`600`),
    fontSize: normalize(10),
    color: colors.TextMuted,
    textAlign: `left`,
  },
  HorizontalLine: {
    backgroundColor: `#24262b`,
    width: `100%`,
    height: 1,
    // marginTop: 20,
    // marginBottom: 10
  },
  Input: {
    ...fontMaker(`700`),
    fontSize: normalize(15),
    borderWidth: 1,
    borderColor: colors.InputBorder,
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    color: colors.Heading,
    alignSelf: `stretch`,
  },
  InputLabel: {
    ...fontMaker(`600`),
    fontSize: normalize(14),
    color: colors.TextMuted,
    textAlign: `left`,
    marginTop: 10,
  },
  TextButton: {
    ...fontMaker(`500`),
    fontSize: normalize(11),
    color: colors.Primary,
    // textAlign: `left`,
  },
  ButtonText: {
    ...fontMaker(`600`),
    fontSize: normalize(18),
    lineHeight: 35,
    color: colors.Heading,
  },
  ButtonContainer: {
    backgroundColor: colors.Primary,
    height: 54,
    padding: 10,
    alignSelf: `stretch`,
  },
  ButtonSecondaryContainer: {
    backgroundColor: colors.Secondary,
    alignSelf: `stretch`,
    height: 54,
    padding: 10,
  },
  NotificationContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: `stretch`,
    position: `absolute`,
  },
  DownloadButton: {
    backgroundColor: colors.Primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: `center`,
    alignItems: `center`,
    flexDirection: `row`,
  },
  DownloadDeleteButton: {
    // backgroundColor: colors.Success,
    // borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: `center`,
    alignItems: `center`,
    flexDirection: `row`,
  },
  DownloadSectionHeader: {
    backgroundColor: colors.Background,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    // justifyContent: `space-between`,
    alignItems: `center`,
    flexDirection: `row`,
  },
  DownloadSectionHeading: {
    ...fontMaker(`500`),
    fontSize: normalize(13),
    color: colors.Primary,
    textAlign: `center`,
    marginRight: 10
  },
  NotificationTitle: {
    ...fontMaker(`800`),
    fontSize: normalize(18),
    lineHeight: 35,
    color: colors.Heading,
    margin: 0,
  },
  NotificationSubtitle: {
    ...fontMaker(`500`),
    fontSize: normalize(14),
    lineHeight: 35,
    color: `rgba(0,0,0,0.5)`,
    margin: 0,
  },
  SearchContainer: {
    backgroundColor: colors.TopBar
  },
  SearchInputContainer: {
    backgroundColor: colors.SecondaryBackground
  },
  SearchInput: {
    color: colors.Heading
  },
  ProfileLabel: {
    ...fontMaker(`300`),
    fontSize: normalize(14),
    color: colors.Heading,
    textAlign: `left`,
  },
  ProfileValue: {
    ...fontMaker(`700`),
    fontSize: normalize(13),
    color: colors.Heading,
    textAlign: `right`,
  },
  PrivateLabel: {
    ...fontMaker(`500`),
    fontSize: normalize(13),
    color: colors.Heading,
    textAlign: `left`,
  },
  PrivateCount: {
    ...fontMaker(`700`),
    fontSize: normalize(12),
    color: colors.BadgeText,
    textAlign: `left`,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 2,
    paddingTop: 2
  },
  SettingsLabel: {
    ...fontMaker(`300`),
    fontSize: normalize(14),
    color: colors.Heading,
    textAlign: `left`,
    marginTop: 15
  },
  SectionHeader: {
    backgroundColor: colors.Background,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  SettingsRow: {
    // backgroundColor: colors.Background,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.Background,
  },
  AppDetails: {
    ...fontMaker(`300`),
    fontSize: normalize(11),
    color: colors.TextMuted,
    textAlign: `center`,
    marginTop: 5,
    opacity: 0.7
  },
  Badge: {
    flexDirection: `row`,
    justifyContent: `center`,
    backgroundColor: colors.Badge,
    minWidth: 30,
    textAlign: `center`
  },

})

export const Select = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: hairline,
    borderColor: colors.Hairline,
    color: colors.TextGrey,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: hairline,
    borderColor: colors.Hairline,
    color: colors.TextGrey,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
}

export const Slider = {
  container:{},
  track:{ height: 3 },
  selected:{ backgroundColor: colors.SliderSelected },
  unselected:{ backgroundColor: colors.SliderUnselected },
  markerContainer:{},
  marker:{},
  pressedMarker: {},
}
