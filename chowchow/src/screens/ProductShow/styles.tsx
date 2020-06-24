import { StyleSheet } from "react-native"
import colors from "chowchow/src/theme/colors"
import theme from "chowchow/src/theme"
import { gutter } from "chowchow/src/theme/theme"

export default StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: colors.Background,
    },
    tabsContainer: {
      backgroundColor: colors.SecondaryBackground
    },
    labelContainer: {
      justifyContent: `center`,
      alignItems: `center`,
      flexDirection: `row`,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop:10,
      paddingBottom: 10,
    },
    tabLabelStyle: {
      ...theme.Paragraph,
      marginLeft: 10,
      color: `#888`,
    },
    tabSelectedLabelStyle: {
      color: colors.Heading
    },
    headingBar: {
      justifyContent: `space-between`,
      alignItems: `center`,
      flexDirection: `row`,
      height: 100,
      paddingRight: 20,
      paddingLeft: 20
    },
    heading: {
      ...theme.Heading,
      textAlign: `left`,
      // backgroundColor: `#F5FCFF`,
    },
    subHeading: {
      ...theme.SubHeading,
      textAlign: `left`,
      // backgroundColor: `#F5FCFF`,
    },
    videoBar: {
      backgroundColor: colors.SecondaryBackground,
    },
    thumbnailBar: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: `row`,
    },
    thumbStyle: {
      backgroundColor: colors.SecondaryBackground,
    },
    selectedThumbStyle: {
      borderColor: colors.Primary,
      borderWidth: 2,
      backgroundColor: colors.SecondaryBackground,
    },
    label: {
      ...theme.Paragraph,
      textAlign: `center`,
      marginTop: 15,
    },
    detailsContainer: {
      alignItems: `flex-start`,
    },
    synopsis: {
      marginLeft: gutter,
      marginRight: gutter,
      marginBottom: 0,
    },
    actionButtonContainer: {
      
      marginTop: 20,
      marginBottom: 10,
    },
    actionButton: {
      backgroundColor: colors.SecondaryBackground,
      padding: 10,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    actionButtonTitle: {
      fontSize: 14,
      fontWeight: `bold`,
      marginLeft: 10,
      textTransform: `uppercase`,
      color: colors.white
    }
  })
