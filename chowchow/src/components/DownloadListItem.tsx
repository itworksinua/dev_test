import * as React from 'react'
import {  Text, View, StyleSheet, } from 'react-native'
import { IMPPlayerItem, IMPDownloadProgress } from 'react-native-mediapeers'
import colors from 'chowchow/src/theme/colors'
import theme from 'chowchow/src/theme'
import { formatFileSize } from 'chowchow/src/manager/filesize'
import DownloadButton from './DownloadButton'
import { IAsset } from '../lib/interfaces'

const HEIGHT = 100

interface DownloadListItemProps extends React.Props<DownloadListItem> {
  productId: number;
  video: IAsset;
  progress: IMPDownloadProgress;
  size: number;
  style?: any;
}

export default class DownloadListItem extends React.PureComponent <DownloadListItemProps> {

  public static height = HEIGHT

  public render() {
    // const image = get(this.props, `video.preview_image`) as IThumborImage

    const video = makePlayerItem(this.props.video)

    return (
      <View style={[this.props.style, styles.cell]}>
        <View style={styles.thumbAndText}>
          {/* <ThumborImage imageStyle={styles.image} image={image} /> */}
          <View style={styles.text}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode={`tail`}
            >
              {this.props.video.name}
            </Text>
            <Text
              style={styles.metadata}
              numberOfLines={1}
              ellipsizeMode={`tail`}
            >
              {formatFileSize(this.props.size)}
            </Text>
          </View>
        </View>

        <DownloadButton
          video={video}
          productId={this.props.productId}
          progress={this.props.progress}
        />
      </View>
    )
  }

}

function makePlayerItem(assetItem: IAsset): IMPPlayerItem {
  const playerItem: IMPPlayerItem = {
    assetId: assetItem.id,
    playlistURL: assetItem.url,
    size: assetItem.estimatedSize
  }

  return playerItem
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.SecondaryBackground,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    paddingRight: 20,
    marginBottom: 10,
    height: HEIGHT - 10,
  },
  thumbAndText: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
  },
  text: {
    marginLeft: 20
  },
  title: {
    ...theme.ItemHeading,
  },
  metadata: {
    ...theme.MetaDetail
  },

})
