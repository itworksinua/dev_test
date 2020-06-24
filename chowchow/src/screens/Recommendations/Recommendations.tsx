import * as React from "react"
import { isEmpty, filter } from 'lodash'
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx'
import { FlatList, SafeAreaView, StyleSheet, ActivityIndicator} from "react-native"
import { localize } from "../../locale"
import { IStore } from "../../store"
import { pushRecommendationsShow, pushProductShow } from "../../navigation"
import RecommendationsItem from './RecommendationsItem'
import RecommendationsEmpty from './RecommendationsEmpty'
import SessionStore from '../../store/sessionStore'
import RecommendationStore from '../../store/recommendationStore'
import theme from '../../theme'
import colors from '../../theme/colors'

interface IRecommendationsProps {
  componentId: string;
  session: SessionStore;
  recommendationStore: RecommendationStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { session, recommendationStore } = store

  const res = {
    session,
    recommendationStore
  }

  return res
})

@observer
class Recommendations extends React.Component<IRecommendationsProps> {

  public static componentName = `Recommendations`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`recommendations:title`)
        },
      }
    }
  }

  public state = {
    assets: null,
    extraData: false,
    loading: true
  }

  public constructor(props: IRecommendationsProps) {
    super(props)

    this.onPress = this.onPress.bind(this)

    const { recommendationStore, session: { session } } = this.props

    recommendationStore.load(session.user.id).then(async () => {
      if (isEmpty(recommendationStore.recommendations)) this.setState({loading: false})

      recommendationStore.getAssets().then(() => {
        recommendationStore.getProducts().then(() => {
          recommendationStore.getUsers().then(() => {
            this.setState({ extraData: true }) // flat list does not rerender when new data gets there hence the promise chain
          })
        })
      })
    })
  }

  public render() {
    const { recommendationStore: { recommendations, assets, products, users } } = this.props

    const objects = {
      assets: assets,
      products: products,
      users: users,
    }

    return (
      <SafeAreaView style={theme.Page}>
        <FlatList
          data={recommendations}
          renderItem={(item) => this.renderItem(item, objects) }
          extraData={this.state}
          ListEmptyComponent={this.state.loading ? renderLoading() : renderEmpty()}
          contentContainerStyle={theme.ContentContainerStyle}
        />
      </SafeAreaView>
    )
  }

  private renderItem(item, objects) {
    return (
      <RecommendationsItem
        item={item}
        objects={objects}
        onPress={this.onPress}
      />
    )
  }

  private onPress(recommendation, objects, i) {
    const index = i.position || 0
    if (recommendation.campaign.target === 'products')
      pushProductShow(this.props.componentId, objects[index].id, false)
    else
      pushRecommendationsShow(this.props.componentId, recommendation.id, index)
  }

}

const renderLoading = () => <ActivityIndicator size="large" color={colors.Primary} style={{marginTop: '70%'}} />
const renderEmpty = () => <RecommendationsEmpty />

export default Recommendations
