import * as React from "react"
import { StyleSheet, Image } from "react-native"
import theme from "../theme"
import logos from "../theme/assets"

interface EmptyListProps {
  title: string;
  subtitle?: string;
}

export default class NavbarLogo extends React.Component<EmptyListProps, any> {

  public static componentName = `NavbarLogo`

  public render() {
    return (
      <Image
        source={logos['https://fremantle.mediapeers.biz']}
        style={[theme.Logo, styles.logo]}
        resizeMode="contain"/>
    )
  }

}

const styles = StyleSheet.create({
  logo: {
    height: 35,
  },
})
