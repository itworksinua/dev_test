import * as React from 'react'
import { ViewProperties, } from 'react-native'
import { inject, observer } from 'mobx-react'
import { PlayerComponent } from 'react-native-mediapeers'
import { IStore } from 'chowchow/src/store'
import { IAsset } from 'chowchow/src/lib/interfaces'
import { registerPlayer } from 'chowchow/src/navigation/videoStack'

interface IFullscreenVideoProps extends ViewProperties {
  video: IAsset;
  store: IStore;
  componentId: string;
}

@inject((store: any) => ({ ...store, }))

@observer
export default class FullscreenVideo extends React.Component<IFullscreenVideoProps>  {

  public static componentName = `FullscreenVideo`

  public render() {

    const dimensions = {
      width: this.props.store.orientation.screenWidth,
      height: this.props.store.orientation.screenHeight
    }

    const options = {
      url: this.props.video.url,
      assetId: this.props.video.id,
      start: true,
      isOffline: true,
      fullscreen: false
    }
    console.log('video...', this.props.video, options)

    return (
      <PlayerComponent
        ref={this.setPlayer}
        options={options}
        style={dimensions}
      />
    )
  }

  private setPlayer = (ref) => {
    registerPlayer(this.props.video.id, ref)
  }

}
