import * as React from "react"
import { observer, inject } from "mobx-react"
import {filter} from 'lodash'
import { SafeAreaView, View, Text } from "react-native"
import FullPager from 'chowchow/src/components/FullPager'
import ThumbPager from 'chowchow/src/components/ThumbPager'
import DotPager from 'chowchow/src/components/DotPager'
import { getWpWithMax, getVideoDimensions } from 'chowchow/src/manager/screen'
import { IStore } from "../../store"
import SessionStore from '../../store/sessionStore'
import RecommendationStore from '../../store/recommendationStore'
import theme from "../../theme"
import styles from './styles'

interface IRecommendationsShowProps {
  recommendationId: number;
  recommendationStore: RecommendationStore;
  index?:number
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { recommendationStore } = store

  const res = {
    recommendationStore
  }

  return res
})

@observer
class RecommendationsShow extends React.Component<IRecommendationsShowProps> {

  public static componentName = `RecommendationsShow`

  public state = {
    assets: null,
    extraData: false,
    slideIndex: this.props.index || 0,
  }

  public constructor(props: IRecommendationsShowProps) {
    super(props)

    this.goToIndex = this.goToIndex.bind(this)

    const { recommendationStore} = this.props
    recommendationStore.getRecommendationById(this.props.recommendationId)
  }

  public render() {
    const { recommendationStore: { recommendation, assets } } = this.props
    let recommendationAssets = filter(assets, (a) => recommendation.asset_ids.includes(a.id))

    const maxWidth = getWpWithMax(`100%`, 800)
    const videoDimensions = getVideoDimensions(maxWidth)

    return (
      <SafeAreaView style={theme.Page}>
        <View style={styles.slider}>
          <FullPager
            data={assets}
            selectedIndex={this.state.slideIndex}
            containerStyle={styles.videoBar}
            videoDimensions={videoDimensions}
            goToIndex={this.goToIndex}
          />
          <ThumbPager
            data={assets}
            selectedIndex={this.state.slideIndex}
            thumbStyle={styles.thumbStyle}
            selectedThumbStyle={styles.selectedThumbStyle}
            containerStyle={styles.thumbnailBar}
            thumbDimensions={{ width: 180,
              height: 101 }}
            margin={5}
            onPress={this.goToIndex}
          />
        </View>
      </SafeAreaView>
    )
  }

  private goToIndex(e: any) {
    this.setState({ slideIndex: e.position })
  }
}

export default RecommendationsShow
