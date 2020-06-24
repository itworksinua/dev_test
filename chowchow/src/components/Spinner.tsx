import * as React from 'react'
import { View, ActivityIndicator } from 'react-native'
import theme from '../theme'
import colors from '../theme/colors'

export default class Spinner extends React.Component  {

  public static componentName = `Spinner`

  public render() {

    return (
      <View style={[theme.SpinnerContainer, theme.PageCenterContent]}>
        <ActivityIndicator size={`large`} color={colors.Primary}/>
      </View>
    )
  }

}
