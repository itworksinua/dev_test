import * as React from "react"
import { isEmpty, map, isEqual, includes } from 'lodash'
import { observer, inject } from "mobx-react"
import { View, SectionList, SafeAreaView, Text } from "react-native"
import { CheckBox, Button } from 'react-native-elements'
import { localize } from "../../locale"
import { IStore } from "../../store"
import SubscriptionsStore from '../../store/subscriptionsStore'
import SessionStore from '../../store/sessionStore'
import { updateUserPreference, deleteSubscriptions } from '../../lib/subscriptionApi'
import SubscriptionsEmpty from './SubscriptionsEmpty'
import SubscriptionsItem from './SubscriptionsItem'
import theme from "../../theme"
import colors from "../../theme/colors"
import style from './styles'

interface ISubscriptionsProps {
  store: IStore;
  subscriptionsStore: SubscriptionsStore;
  session: SessionStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { subscriptionsStore, session } = store

  const res = {
    subscriptionsStore,
    session
  }

  return res
})

@observer

class Subscriptions extends React.Component<ISubscriptionsProps, any> {
  public static componentName = `Subscriptions`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`subscriptions:title`)
        },
      }
    }
  }

  public initialStatePreferences = {
    'None': false, 'Daily': false,
    'Weekly': false, 'Monthly': false
  }

  public state = {
    preferences: this.initialStatePreferences,
    checkedProducts: []
  }

  public constructor(props: ISubscriptionsProps) {
    super(props)

    const {subscriptionsStore} = this.props

    subscriptionsStore.load()
    subscriptionsStore.getSubscriptionPreference()
  }

  public componentDidUpdate() {
    const { subscriptionsStore: {subscriptionPreference} } = this.props

    if (subscriptionPreference && isEqual(this.state.preferences, this.initialStatePreferences)) {
      this.setPreference(subscriptionPreference.frequency)
    }
  }

  public render() {
    const { subscriptionsStore: {subscriptions, subscriptionPreference} } = this.props
    const frequencies = ['None', 'Daily', 'Weekly', 'Monthly']

    return (
      <SafeAreaView style={theme.Page}>
        <View style={style.container}>
          <Text style={style.label}>EMAIL FREQUENCY</Text>

          {map(frequencies, (f, index) => {
            return(
              <CheckBox
              title={f}
              key={index}
              checkedColor={colors.white}
              checkedIcon={`square`}
              checked={this.state.preferences[f]}
              containerStyle={{backgroundColor: colors.Background, borderColor: colors.Background}}
              textStyle={{color: colors.white}}
              onPress={() => this.setPreference(f)}
              />
            )
          })}
        </View>

        <View style={style.container}>
          <Text style={style.label}>SUBSCRIBED PRODUCTS</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button buttonStyle={style.button} containerStyle={{marginLeft: 10, width: 150}} title='Remove' onPress={() => this.remove()} />
            <Button buttonStyle={style.button} containerStyle={{width: 150, marginRight: 10,}} title='Select All' onPress={() => this.selectAll()} />
          </View>

          <View  style={{ flexDirection: 'column'}}>
            {map(subscriptions, (s, index) => {
              return(
                <CheckBox
                title={s.display_title}
                key={index}
                checkedColor={colors.white}
                checkedIcon={`square`}
                checked={includes(this.state.checkedProducts, s.subscriptionId)}
                containerStyle={{backgroundColor: colors.Background, borderColor: colors.Background}}
                textStyle={{color: colors.white, textTransform:`capitalize`}}
                onPress={() => this.selectProducts(s.subscriptionId)}
                />
              )
            })}
          </View>
        </View>
      </SafeAreaView>
    )
  }

  private setPreference = (frequency) => {
    const {session: {session: {user}}, subscriptionsStore: {subscriptionPreference}} = this.props
    const obj = {}
    obj[frequency] = !this.state.preferences[frequency]

    this.setState({preferences: {...this.initialStatePreferences, ...obj} }, () => {
      updateUserPreference(subscriptionPreference.id, user.id, frequency)
    })
  }

  private selectProducts = (id) => {
    this.setState(state => {
      const checkedProducts = state.checkedProducts.includes(id) ? state.checkedProducts.filter((item) => id !== item) : state.checkedProducts.concat(id)

      return {
        checkedProducts
      }
    })
  }

  private selectAll = () => {
    const { subscriptionsStore: {subscriptions}} = this.props

    if (this.state.checkedProducts.length === subscriptions.length)
      this.setState({checkedProducts: []})
    else
      this.setState({checkedProducts: map(subscriptions, 'subscriptionId')})
  }

  private remove = () => {
    const {session} = this.props

    deleteSubscriptions(this.state.checkedProducts)
    .then(() => {
      this.props.subscriptionsStore.load().then(() => {
        this.setState({checkedProducts: []})
        session.loadStats()
      })
    })
  }
}

export default Subscriptions
