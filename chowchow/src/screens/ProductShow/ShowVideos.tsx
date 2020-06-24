import * as React from "react"
import { View, Text, StyleSheet, TouchableOpacity, } from "react-native"
import ThumborImage from 'chowchow/src/components/ThumborImage'
import { IPreviewImage } from 'chowchow/src/lib/interfaces'

import theme from "chowchow/src/theme"
import colors from "chowchow/src/theme/colors"
import DownloadButton from "chowchow/src/components/DownloadButton"
import { localize } from "chowchow/src/locale"
import { formatFileSize } from "chowchow/src/manager/filesize"
import { gutter } from "chowchow/src/theme/theme"
import { showVideo } from "chowchow/src/navigation"
import { IAsset } from 'chowchow/src/lib/interfaces'

interface EmptyListProps {
  videos: IAsset[];
  productId: number;
}

class ShowVideos extends React.Component<EmptyListProps, any> {

  public render() {

    const { productId, videos } = this.props
    const children = videos.map((video) => buildAssetRow(productId, video))

    return (
      <View style={styles.container} >
        <Text style={styles.heading}>{localize(`product:videos`)}</Text>
        <View style={styles.list}>{children}</View>
      </View>
    )
  }

}

function buildAssetRow(productId: number, asset: IAsset) {
  const image = asset.preview_image
  const size = formatFileSize(asset.estimatedSize)
  const videoItem = asset.item

  return (
    <View style={styles.row} key={`${asset.id}`}>
      <TouchableOpacity style={styles.touchable} onPress={() => showVideo(asset)}>
        <ThumborImage imageStyle={styles.image} image={image} />
      </TouchableOpacity>
      <View style={styles.details}>
        <Text
          style={styles.title}
          numberOfLines={3}
          ellipsizeMode={`tail`}
        >
          {asset.name}
        </Text>
        <Text style={styles.metadata}>{size}</Text>
      </View>

      <DownloadButton
        style={styles.button}
        productId={productId}
        item={videoItem}
      />
    </View>
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
  touchable: {
    flexDirection: `row`,
    alignItems: `center`,
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
  button:{
    marginRight: gutter,
    marginLeft: gutter
  }
})

export default ShowVideos
