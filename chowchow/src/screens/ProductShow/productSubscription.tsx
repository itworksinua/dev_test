import * as React from "react"
import { View, StyleSheet, Text } from "react-native"
import Button from 'react-native-button'
import { subscribe, unsubscribe }  from '../../lib/subscriptionApi'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../../theme/colors'
import styles from './styles'
import { gutter } from "../../theme/theme"
import { localize } from "../../locale"

const SubscriptionButton = (props: any) => {
  const { productId, userId, subscribe: { isSubscribed }, onUpdate } = props

  return (
    <View>
      <Button
        containerStyle={styles.actionButton}
        onPress={() => subscribeToVideos(productId, userId, isSubscribed, onUpdate)}
      >
        {getButtonContents(isSubscribed)}
      </Button>
    </View>
  )
}

const getButtonContents = (isSubscribed) => {

  const icon = (isSubscribed) ? `ios-checkmark-circle`: `ios-checkmark-circle-outline`
  const label =  (isSubscribed) ? localize(`subscribe:button:add`) : localize(`subscribe:button:remove`)

  return (
    <View style={localStyle.container}>
      <Icon
        name={icon}
        size={20}
        color={colors.Primary}
      />
      <Text style={styles.actionButtonTitle}>{label}</Text>
    </View>
  )
}

const subscribeToVideos = async (productId, userId, isSubscribed, onUpdate) => {
  if (isSubscribed) {
    await unsubscribe(productId)
    onUpdate({ isSubscribed: false })
    
  } else {
    await subscribe(productId, userId)
    onUpdate({ isSubscribed: true })
    
  }
}

const localStyle = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`
  }
})

export default SubscriptionButton
