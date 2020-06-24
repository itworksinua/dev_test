import * as React from "react"
import moment from 'moment'
import { toJS } from 'mobx'
import { filter, find } from 'lodash'
import { View, StyleSheet, Text } from "react-native"
import ScreeningsShow from '../ScreeningsShow'
import ProductShow from '../ProductShow'
import ThumbPager from 'chowchow/src/components/ThumbPager'
import colors from "chowchow/src/theme/colors"
import { localize } from "../../locale"

const RecommendationsItem = (props: any, state: any) => {
  state = { categoryIndex: 0 }
  const { item: { item }, objects: { assets, products, users } } = props
  const targetObjects = item.campaign.target === `assets` ? filter(assets, (o) => item.asset_ids.includes(o.id)) :
    filter(products, (o) => item.product_ids.includes(o.id))
  const user = find(users, { id: item.campaign.from_user_id }) as any

  if (!user) return null

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.options,
        color: `#fff` }}>{user.first_name} {user.last_name}</Text>
      <Text style={{ ...styles.options,
        color: `#898989` }}>{moment(item.created_at).format(`DD MMMM YYYY h:mm:ssA`)}</Text>
      <Text style={{ ...styles.options,
        color: `#fff`,
        marginBottom: 10 }}>{item.campaign.subject}</Text>
      <Text style={{ ...styles.options,
        color: `#fff` }}><Text style={styles.options}>Titles Recommended:</Text> {targetObjects.length}</Text>
      <Text style={{ ...styles.options,
        color: `#fff` }}><Text style={styles.options}>Expiration Date:</Text> {moment(item.expires_at).format(`DD MMMM YYYY h:mm:ssA`)}</Text>
      <Text style={{ ...styles.options,
        color: `#fff` }}><Text style={styles.options}>Views Remaining:</Text> {item.views_left || `unlimited`}</Text>

      <View style={styles.slider}>
        <ThumbPager
          data={targetObjects}
          selectedIndex={state.categoryIndex}
          thumbStyle={styles.thumbStyle}
          selectedThumbStyle={styles.selectedThumbStyle}
          containerStyle={styles.thumbnailBar}
          thumbDimensions={{ width: 180,
            height: 101 }}
          margin={5}
          onPress={(index) => props.onPress(item, targetObjects, index)}
        />
      </View>
    </View>
  )
}

export default RecommendationsItem

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    color: `#fff`,
    fontSize: 20,
    fontWeight: `bold`,
    marginBottom: 5
  },
  options: {
    color: `red`,
    fontWeight: `bold`,
    fontSize: 15
  },
  slider: {
    marginTop: 10,
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
})
