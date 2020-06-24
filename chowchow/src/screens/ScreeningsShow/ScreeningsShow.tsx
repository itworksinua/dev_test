import * as React from "react"
import { observer, inject } from "mobx-react"
import { SafeAreaView, View, Text } from "react-native"
import { filter } from "lodash"
import FullPager from 'chowchow/src/components/FullPager'
import ThumbPager from 'chowchow/src/components/ThumbPager'
import DotPager from 'chowchow/src/components/DotPager'
import { getWpWithMax, getVideoDimensions } from 'chowchow/src/manager/screen'
import { IStore } from "../../store"
import SessionStore from '../../store/sessionStore'
import ScreeningStore from '../../store/screeningStore'
import theme from "../../theme"
import styles from './styles'

interface IScreeningsShowProps {
  screeningId: number;
  session: SessionStore;
  screeningStore: ScreeningStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { session, screeningStore } = store

  const res = {
    session,
    screeningStore
  }

  return res
})

@observer
class ScreeningsShow extends React.Component<IScreeningsShowProps> {

  public static componentName = `ScreeningsShow`

  public state = {
    assets: null,
    extraData: false,
    slideIndex: 0,
  }

  public constructor(props: IScreeningsShowProps) {
    super(props)

    this.goToIndex = this.goToIndex.bind(this)

    const { screeningStore, session: { session } } = this.props
    screeningStore.getScreeningById(this.props.screeningId)
  }

  public render() {
    const { screeningStore: { screening, screeningAssets } } = this.props
    const assets = filter(screeningAssets, (a) => a.screening_id.includes(screening.id))

    const maxWidth = getWpWithMax(`100%`, 800)
    const videoDimensions = getVideoDimensions(maxWidth)

    return (
      <SafeAreaView style={theme.Page}>
        <View style={styles.slider}>
          <Text style={styles.title}>{screening.name}</Text>
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

          <DotPager
            pageCount={assets.length}
            selectedIndex={this.state.slideIndex}
            hideSingle={false}
          />
        </View>
      </SafeAreaView>
    )
  }

  private goToIndex(e: any) {
    this.setState({ slideIndex: e.position })
  }
}

export default ScreeningsShow
