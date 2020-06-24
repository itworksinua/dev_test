import * as React from "react"
import { View, Text, StyleSheet } from "react-native"
import theme from "../theme"

interface EmptyListProps {
  title: string;
  subtitle?: string;
}

class EmptyList extends React.Component<EmptyListProps, any> {

  public render() {
    return (
      <View style={[theme.Page, theme.PageCenterContent,]}>
        <View style={styles.container}>
          <Text style={theme.Heading}>{this.props.title}</Text>
          {
            this.props.subtitle &&
            <Text style={theme.SubHeading}>{this.props.subtitle}</Text>
          }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: `center`,
    textAlign: `center`,
    marginBottom: 30,
    justifyContent: `center`,
    width: `80%`,
  },
})

export default EmptyList
