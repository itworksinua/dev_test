import * as React from "react"

import { View, Text, StyleSheet, TouchableHighlight } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import theme from "../../theme"
import colors from "../../theme/colors"
import { gutter } from "../../theme/theme"

interface PrivateItemProps {
  title: string;
  icon?: string;
  count?: number;
  onPress?: () => {};
}

const PrivateItem = (props: PrivateItemProps) => {

  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={styles.container}>
        
        <View style={styles.iconLabelContainer}>
          
          { props.icon !== undefined &&
            <View style={styles.iconContainer}>
              <Icon name={props.icon} color={colors.Icon} size={30}/>
            </View>          
          }

          <Text style={theme.PrivateLabel}>{props.title}</Text>
        </View>

        { props.count !== undefined &&
          <View style={styles.badge}>
            <Text style={theme.PrivateCount}>{props.count}</Text>
          </View>
        }

      </View>
    </TouchableHighlight>
  )
}

// const touchableOrNot = (onPress) => {
//   const element = (onPress !== undefined)
//     ? TouchableHighlight
//     : View
// }

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`,
    borderTopWidth: 1,
    borderTopColor: colors.SecondaryBackground,
    paddingLeft: 10,
    paddingRight: 10,
    height: 50
  },
  iconContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    
    width: 40,
    marginLeft:gutter,
    marginRight:gutter,
  },
  iconLabelContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    // backgroundColor: `yellow`
  },
  badge: {
    ...theme.Badge,
    marginRight:gutter,
  }
})

export default PrivateItem