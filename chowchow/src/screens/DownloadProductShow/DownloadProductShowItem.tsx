import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native'

import theme, { gutter } from 'chowchow/src/theme/theme'
import colors from 'chowchow/src/theme/colors'
import DownloadButton from 'chowchow/src/components/DownloadButton'
import ThumborImage from 'chowchow/src/components/ThumborImage'
import { formatFileSize } from 'chowchow/src/manager/filesize'
import { showVideo } from 'chowchow/src/navigation'
import { IAsset } from 'chowchow/src/lib/interfaces'

interface IDownloadProductShowItemProps extends React.Props<DownloadProductShowItem> {
  key: string;
  asset: IAsset;
}

export default class DownloadProductShowItem extends React.Component<IDownloadProductShowItemProps, null> {

  public constructor(props){
    super(props)
  }

  public render(){

    const { asset } = this.props

    const productId = asset.product_id
    const image = asset.preview_image
    const videoItem = asset.item

    const size = videoItem.size || asset.estimatedSize
    const formattedSize = formatFileSize(size)

    return (
      <View style={styles.row}>
        <TouchableOpacity style={styles.touchable}  delayPressIn={50} onPress={() => showVideo(asset)}>
          <ThumborImage imageStyle={styles.image} image={image} />
        </TouchableOpacity>
        <View style={styles.details}>
          <Text style={styles.title}>{asset.name}</Text>
          <Text style={styles.metadata}>{formattedSize}</Text>
        </View>

        <DownloadButton
          style={styles.button}
          productId={productId}
          item={videoItem}
        />
      </View>
    )

  }

}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.SecondaryBackground,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    height: 81,
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
