import * as React from 'react'
import { View, StyleSheet, ActivityIndicator } from "react-native"
import colors from '../theme/colors'

const CenterSpinner = () => {

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.ActivityIndicator} />
    </View>
  )
}

CenterSpinner.componentName = `CenterSpinner`

export default CenterSpinner

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`
  },

})