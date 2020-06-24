import * as React from 'react'
import { View, StyleSheet, Text } from "react-native"

const TopBar = (props) => {

  return (
    <View style={styles.container}>
      <Text>Topbar</Text>
    </View>
  )
}

TopBar.componentName = `TopBar`

export default TopBar

const styles = StyleSheet.create({
  container: {
    backgroundColor: `pink`,
    flex: 1,
    position: `absolute`
  }
})