import * as React from 'react'
import Button from "react-native-button"
import { View, StyleSheet, Text } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import theme from '../theme'

interface SelectableTitleProps {
  title: string;
  onPress: () => void;
}

const SelectableTitle = (props: SelectableTitleProps) => {

  return (
    <Button onPress={props.onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>
        <Icon
          name="ios-arrow-down"
          size={15}
          color="white"
        />
      </View>
    </Button>
  )
}

SelectableTitle.componentName = `SelectableTitle`

export default SelectableTitle

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`
  },
  title: {
    ...theme.PageTitle,
    marginRight: 5
  }

})