import * as React from "react"
import moment from 'moment'
import { View, StyleSheet, Text } from "react-native"
import { pushScreeningsShow } from '../../navigation'
import ThumbPager from 'chowchow/src/components/ThumbPager'
import colors from "chowchow/src/theme/colors"

const ScreeningsItem = (props: any, state: any) => {
  state = { categoryIndex: 0 }
  const { item: { item }, assets } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={{ ...styles.options,
        color: `#fff` }}><Text style={styles.options}>Setup at:</Text>{moment(item.created_at).format(`DD MMMM YYYY h:mm:ssA`)}</Text>
      <Text style={{ ...styles.options,
        color: `#fff` }}><Text style={styles.options}>Video Count:</Text> {assets.length}</Text>

      <View style={styles.slider}>
        <ThumbPager
          data={assets}
          selectedIndex={state.categoryIndex}
          thumbStyle={styles.thumbStyle}
          selectedThumbStyle={styles.selectedThumbStyle}
          containerStyle={styles.thumbnailBar}
          thumbDimensions={{ width: 180,
            height: 101 }}
          margin={5}
          onPress={() => props.onPress(item.id)}
        />
      </View>
    </View>
  )
}

export default ScreeningsItem

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
