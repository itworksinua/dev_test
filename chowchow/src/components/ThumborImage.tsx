import * as React from 'react'
import { ImageStyle } from 'react-native'
import Image from 'react-native-fast-image'
import { isEmpty } from 'lodash'
import CryptoJS from 'crypto-js'
import FastImage from 'react-native-fast-image'
import { IPreviewImage } from 'chowchow/src/lib/interfaces'

export interface IThumborImageProps extends React.Props<ThumborImage> {
  image: IPreviewImage;
  width?: number;
  height?: number;
  method?: string;
  imageStyle?: ImageStyle;
  resizeMode?: FastImage.ResizeMode;
}

export default class ThumborImage extends React.PureComponent <IThumborImageProps> {

  public static defaultProps: IThumborImageProps | {} = {
    type: `background`,
    method: `fit-in`,
    width: 640,
    height: 360,
  }

  public render() {
    if (!this.props.image) return null

    const resizeMode = (this.props.resizeMode) ? this.props.resizeMode : `cover`

    return (
      <Image style={this.props.imageStyle} source={{ uri: this.generateUri() }} resizeMode={resizeMode}/>
    )
  }

  private generateUri() {
    if ( !this.props.image || isEmpty(this.props.image)) return

    const {
      width, height, method,
      image: { url, signing_key, distribution_url },
    } = this.props

    let call = `${method}/${width}x${height}/${url}`

    const token = CryptoJS.enc.Base64
      .stringify(CryptoJS.HmacSHA1(call, signing_key))
      .replace(/\+/g, `-`)
      .replace(/\//g, `_`)

    return `${distribution_url}/${token}/${call}`
  }

}
