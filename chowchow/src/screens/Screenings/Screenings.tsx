import * as React from "react"
import { isEmpty, filter } from 'lodash'
import { observer, inject } from "mobx-react"
import { FlatList, SafeAreaView, ActivityIndicator } from "react-native"
import { localize } from "../../locale"
import { IStore } from "../../store"
import { pushScreeningsShow } from "../../navigation"
import ScreeningsEmpty from './ScreeningsEmpty'
import ScreeningsItem from './ScreeningsItem'
import SessionStore from '../../store/sessionStore'
import ScreeningStore from '../../store/screeningStore'
import theme from "../../theme"
import colors from '../../theme/colors'

interface IScreeningsProps {
  componentId: string;
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
class Screenings extends React.Component<IScreeningsProps> {

  public static componentName = `Screenings`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`screenings:title`)
        },
      }
    }
  }

  public state = {
    assets: null,
    extraData: false,
    loading: true,
  }

  public constructor(props: IScreeningsProps) {
    super(props)

    const { screeningStore, session: { session } } = this.props

    screeningStore.load(session.user.id).then(async () => {
      if (isEmpty(screeningStore.screenings)) this.setState({loading: false})

      await screeningStore.getScreeningAssets()
    })

    this.onPress = this.onPress.bind(this)
  }

  public render() {
    const { screeningStore } = this.props

    const data = screeningStore.screenings
    const assets = screeningStore.screeningAssets

    // Shouldn't changes state in render
    if (!this.state.extraData && !isEmpty(data) && !isEmpty(assets)) {
      this.setState({
        extraData: true,
        assets: assets
      })
    }

    return (
      <SafeAreaView style={theme.Page}>
        <FlatList
          data={data}
          renderItem={(item) => this.renderItem(item, assets) }
          extraData={this.state}
          ListEmptyComponent={this.state.loading ? renderLoading() : renderEmpty()}
          contentContainerStyle={theme.ContentContainerStyle}
        />
      </SafeAreaView>
    )
  }

  private renderItem(item, assets) {
    return (
      <ScreeningsItem
        item={item}
        onPress={this.onPress}
        assets={filter(assets, (a) => a.screening_id.includes(item.item.id))}/>
    )
  }

  private onPress(id) {
    pushScreeningsShow(this.props.componentId, id)
  }

}

const renderLoading = () => <ActivityIndicator size="large" color={colors.Primary} style={{marginTop: '70%'}} />
const renderEmpty = () => <ScreeningsEmpty />

export default Screenings
