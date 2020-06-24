import { StyleSheet,  } from "react-native"
import colors from "chowchow/src/theme/colors"
import theme from "chowchow/src/theme"
import { gutter } from "chowchow/src/theme/theme"

export default StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: colors.Background,
      marginTop: 15,
      marginLeft: 5,
      marginRight: 5,
      padding: 10,
    },
    label: {
      color: `#fff`,
      fontSize: 15,
      fontWeight: `bold`,
      textTransform: 'capitalize',
      marginLeft: 10,
      marginBottom: 10,
      marginTop: 10,
      width: '90%', 
    },
    button: {
      backgroundColor: colors.Primary,
      marginTop: 10
    },
    badge: {
      ...theme.Badge,
      marginRight:gutter,
    },
    icon: {
      color: colors.Primary,
      textAlign: `left`,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 5,
      paddingTop: 5
    }
  })
