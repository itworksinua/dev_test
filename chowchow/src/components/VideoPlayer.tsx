import * as React from "react"
import Button from "react-native-button"
import { get } from 'lodash'
import { ViewProperties, View, Image, StyleSheet } from "react-native"
import MPPlayerComponent from "react-native-mediapeers"
import ThumborImage from "chowchow/src/components/ThumborImage"
import { getVideoUrl } from "../lib/assetApi"
import { IAsset } from "../lib/interfaces"
// import playButton from "chowchow/assets/images/play-button.png"

interface IVideoPlayerProps extends ViewProperties {
  video: IAsset;
  dimensions: any;
  isVisible: boolean;
}

interface IVideoPlayerState  {
  playlistURL: boolean;
}

export default class VideoPlayer extends React.Component <IVideoPlayerProps, IVideoPlayerState> {

  public constructor(props: IVideoPlayerProps) {

    super(props)

    this.state = {
      playlistURL: null,
    }

    this.init(props.video)

  }

  private async init(video) {
    const playlistURL = await getVideoUrl(video.id)

    this.setState({ playlistURL })
  }

  public render() {

    const { playlistURL } = this.state
    const { dimensions, video } = this.props

    if (!playlistURL) {
      
      const image = video.preview_image

      return (
        <View>  
          <ThumborImage imageStyle={dimensions} image={image} />
        </View>
      )
    }

    const options = {
      url: playlistURL,
      assetId: video.id,
      start: false,
      isOffline: true,
      fullscreen: false
    }

    alert(JSON.stringify(options, null, 2))

    return (
      <View> 
        <MPPlayerComponent
          options={options}
          style={dimensions}
        />
      </View>
    )
  }

}

// const styles = StyleSheet.create({
//   container: {
//     alignItems: `center`,
//     justifyContent: `center`,
//     position: `absolute`
//   },
//   button: {
//     alignSelf: `center`
//   },
//   icon: {
//     width: 60,
//     height: 60,
//     backgroundColor: `rgba(0,0,0,0.3)`,
//     borderRadius: 30,
//     // right: 30,
//     // bottom: 30
//   }
// })

