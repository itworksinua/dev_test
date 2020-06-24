import * as React from "react"
import { View, StyleSheet, Text } from "react-native"
import { localize } from "../../locale"

const SubscriptionsItem = (props: any) => {
  const product = props.item.item

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{product.display_title}</Text>
    </View>
  )
}

export default SubscriptionsItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: `#fff`,
    fontSize: 15,
    fontWeight: `bold`,
    marginTop: 10
  }
})
