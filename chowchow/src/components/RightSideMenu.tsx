import * as React from "react"
import { StyleSheet, View, Text } from "react-native"
import { ListItem } from 'react-native-elements'
import colors from '../theme'

const list = [
  {
    title: `DOWNLOADS`,
    icon: `av-timer`
  },
  {
    title: `RECOMMENDATIONS`,
    icon: `list`
  },
  {
    title: `SCREENINGS`,
    icon: `tv`
  },
  {
    title: `FAVORITES`,
    icon: `play-circle-outline`
  },
  {
    title: `SUBSCRIPTIONS`,
    icon: `check-circle`
  },
  {
    title: `PROFILE`,
    icon: `person`
  },
  {
    title: `LOG OUT`,
    icon: `lock`
  }
]

export default class SideMenu extends React.Component<any, any> {

  public static componentName = `RightSideMenu`

  public render() {
    return (
      <View style={{ margin: `5%` }}>
        <Text style={{ color: `#fff`,
          fontWeight: `bold`,
          margin: 10,
          fontSize: 24 }}>{this.props.userName}</Text>
        {
          list.map(({ title, icon }, i) => (
            <ListItem
              key={i}
              title={title}
              underlayColor={{ color: `red` }}
              style={{ textAlign: `center` }}
              leftIcon={{ name: icon,
                color: `#535458` }}
              containerStyle={title === `SUBSCRIPTIONS` ? { backgroundColor: colors[`Background`],
                margin: 5 } : { backgroundColor: colors[`Primary`],
                margin: 5 }}
              titleStyle={{ color: `white`,
                fontWeight: `bold`,
                fontSize: 18 }}
              onPress={() => {}}
              badge={title === `LOG OUT` ? null : { value: 330,
                containerStyle: { backgroundColor: `#535458` },
                badgeStyle: { padding: 4,
                  backgroundColor: `#535458`,
                  borderColor: `#535458` } }}
              bottomDivider={title === `SUBSCRIPTIONS`}
            />
          ))
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  ratingText: {
    paddingLeft: 10,
    color: `grey`
  }
})
