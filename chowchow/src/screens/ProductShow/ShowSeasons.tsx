import * as React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { View, Text, StyleSheet, TouchableOpacity, } from "react-native"

import theme from "chowchow/src/theme"
import colors from "chowchow/src/theme/colors"
import ThumborImage from "chowchow/src/components/ThumborImage"
import { localize } from "chowchow/src/locale"
import { gutter } from "chowchow/src/theme/theme"
import { IPreviewImage } from 'chowchow/src/lib/interfaces'
import { ISlimProduct } from 'chowchow/src/lib/interfaces'

interface EmptyListProps {
  seasons: ISlimProduct[]
  onPress: (product: ISlimProduct) => {}
}

class ShowSeasons extends React.Component<EmptyListProps, any> {

  public render() {

    const { seasons, onPress } = this.props

    const children = seasons.map((season, i) => buildSeasonRow(season, onPress,i))

    return (

      <View style={styles.container} >
        <Text style={styles.heading}>{localize(`product:seasons`)}</Text>
        <View style={styles.list}>{children}</View>
      </View>

    )
  }

}

function buildSeasonRow(season: ISlimProduct, onPress, key) {

  const image = season.preview_image
  const episodes = localize(`product:episodes_count`, { smart_count: season.episodes_count })

  return (
    <TouchableOpacity key={key} onPress={() => onPress(season)}>
      <View style={styles.row} >
        <ThumborImage imageStyle={styles.image} image={image} />
        <View style={styles.details}>
          <Text style={styles.title}>{season.display_title}</Text>
          <Text style={styles.metadata}>{episodes}</Text>
        </View>
        <Icon name={`ios-arrow-forward`} style={styles.icon} size={15} color={colors.TextMuted}/>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: gutter,
    // marginRight: gutter,
  },
  heading: {
    marginLeft: gutter,
    ...theme.MetaHeading
  },
  list: {
    marginTop: 5
  },
  row: {
    backgroundColor: colors.SecondaryBackground,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    marginBottom: gutter,
  },
  details: {
    marginLeft: gutter,
    flex: 1,
    flexWrap: `wrap`,
  },
  title: {
    ...theme.ItemHeading,
  },
  metadata: {
    ...theme.MetaDetail
  },
  image: {
    height: 81,
    width: 144,
  },
  icon: {
    marginRight: 20
  }
})

export default ShowSeasons
