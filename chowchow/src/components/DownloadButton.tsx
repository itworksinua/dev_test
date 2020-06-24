import * as React from 'react'
import colors from 'chowchow/src/theme/colors'
import theme from 'chowchow/src/theme'
import * as Progress from 'react-native-progress'
import { StyleSheet, View, Image, } from 'react-native'
import Button from "react-native-button"
import Icon from 'react-native-vector-icons/Ionicons'
import { IMPPlayerItem } from 'react-native-mediapeers'
import store from '../store'
import { downloadIconSize, downloadDeleteIconTop, downloadCheckmarkIconSize } from '../theme/theme'
import DownloadIcon from "chowchow/assets/images/download-box.png"

interface DownloadButtonProps extends React.Props<DownloadButton> {
  productId: number;
  item: IMPPlayerItem;
  style?: any;
}

export default class DownloadButton extends React.PureComponent <DownloadButtonProps> {

  public render() {

    const { item, productId } = this.props
    const { progress: { progressValue, progress } } = item

    const isPending = !!(progress == `inQueue`)
    const isDownloading = !!(progress == `inProgress` )
    const isDownloaded = !!(progress == `complete`)
    const hasStartedDownloading = !!(isPending || isDownloading || isDownloaded)
    const progressColor = (isDownloading || isDownloaded) ? colors.Success : colors.Info

    return (
      <View style={[styles.container, this.props.style]}>

        {
          ( isDownloading || isPending ) &&
          <Button
            onPress={() => store.download.remove(item.assetId)}
          >
            <Progress.Circle
              color={progressColor}
              progress={progressValue}
              size={theme.DownloadButton.width}
            >
              <Icon name="ios-square" size={15} color={progressColor} style={styles.stopIcon}/>
            </Progress.Circle>

          </Button>
        }

        {
          !hasStartedDownloading &&
          <Button
            containerStyle={theme.DownloadDeleteButton}
            style={theme.ButtonText}
            onPress={() => store.download.start(productId, item.assetId)}
          >
            {/* <Icon name="ios-download" size={downloadIconSize} color={colors.SecondaryBackground} /> */}
            <Image source={DownloadIcon} />
          </Button>
        }

        {
          isDownloaded &&
          <Button
            containerStyle={theme.DownloadDeleteButton}
            style={theme.ButtonText}
            onPress={() => store.download.remove(item.assetId)}
          >
            <Icon name="ios-checkmark" size={downloadCheckmarkIconSize} color={colors.Success} style={styles.deleteIcon} />
          </Button>
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: `space-between`,
    alignItems: `center`,
    flexDirection: `row`,
  },
  stopIcon: {
    position: `absolute`,
    alignSelf: `center`,
    top: 12,
  },
  deleteIcon: {
    top: downloadDeleteIconTop
  }
})
