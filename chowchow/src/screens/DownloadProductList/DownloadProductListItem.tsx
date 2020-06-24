import * as React from "react"
import { View, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from "react-native"
import { localize } from "chowchow/src/locale"
import ThumborImage from "chowchow/src/components/ThumborImage"
import colors from "chowchow/src/theme/colors"
import theme from "chowchow/src/theme"
import Icon from "react-native-vector-icons/Ionicons"
import { gutter } from "chowchow/src/theme/theme"
import { IPreviewImage } from 'chowchow/src/lib/interfaces'
import { formatFileSize } from "../../manager/filesize"

interface IDownloadProductListItemProps extends React.Props<DownloadProductListItem> {
  id: number;
  title: string;
  type: string;
  videoCount: number;
  totalSize: number;
  previewImage: IPreviewImage;
  onPress: (product: any) => void;
}

class DownloadProductListItem extends React.Component<IDownloadProductListItemProps> {

  public constructor(props) {
    super(props)

    this.onPress = this.onPress.bind(this)
  }

  public render() {

    const { previewImage, videoCount, title, totalSize } = this.props
    const meta = localize(`product:videos_count`,{ smart_count: videoCount }) + ` • ` + formatFileSize(totalSize)

    return (

      <TouchableHighlight onPress={this.onPress} delayPressIn={50}>
        <View style={styles.row} >
          <ThumborImage imageStyle={styles.image} image={previewImage} />
          <View style={styles.details}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.metadata}>{meta}</Text>
          </View>
          <Icon name={`ios-arrow-forward`} style={styles.icon} size={15} color={colors.TextMuted}/>
        </View>
      </TouchableHighlight>
    )
  }

  private onPress(){
    const { id, type, title, onPress } = this.props

    onPress({
      id,
      type,
      title
    })
  }

}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.SecondaryBackground,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    height: 81
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

export default DownloadProductListItem
