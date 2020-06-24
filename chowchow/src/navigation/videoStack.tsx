import { IAsset } from 'chowchow/src/lib/interfaces'
import VideoPlayer from '../screens/FullscreenVideo'
import { getVideoUrl } from "../lib/assetApi"
import { Navigation } from 'react-native-navigation'
import { get } from 'lodash'

const videoStack = (video: IAsset) => {
  return {
    component: {
      name: VideoPlayer.componentName,
      passProps: {
        video,
      },
      options: {
        topBar: {
          visible: false
        },
        layout: {
          backgroundColor: `black`,
        }
      }
    }
  }
}

/**
 * Video methods
 */

let videoId = null
let modalId = null
let playerInstances = {}

export const registerPlayer = (videoId, instance) => {
  playerInstances[videoId] = instance
}

export const destroyPlayer = (videoId) => {
  const player = playerInstances[videoId]
  if (!player) { return }

  player.destroy()
  delete playerInstances[videoId]
}

export const showVideo = async (video: IAsset) => {

  if (modalId !== null) return

  const progress = get(video, `item.progress.progressValue`)
  const isOffline = progress === 1

  if (!isOffline) {
    video.url = await getVideoUrl(video.id)
  }

  const id = await Navigation.showModal(videoStack(video))

  modalId = id
  videoId = video.id

  console.log(`show video`)
}

export const hideVideo = () => {

  if (!modalId) return

  Navigation.dismissModal(modalId)
  destroyPlayer(videoId)

  modalId = null
  videoId = null

  console.log(`hide video`)
}

export const listenForClosingVideo = () => {
  return Navigation.events().registerComponentDidDisappearListener(({ componentId, componentName }) => {
    console.log(`dissappearing`, componentId,componentName)

    if (componentName === VideoPlayer.componentName) {
      destroyPlayer(videoId)

      modalId = null
      videoId = null
    }
  })
}
