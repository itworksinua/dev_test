import * as React from 'react'
import Button from "react-native-button"
import { View, SafeAreaView, StyleSheet, TouchableHighlight, ScrollView} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { pushGenre } from '../../navigation'
import { Text } from 'react-native-elements'
import theme from '../../theme'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../../theme/colors'

interface GenreModalProps {
  componentId: string;
  genres: any[];
  onChange?: Function;
}

const GenreModal = (props: GenreModalProps) => {

  const { genres, onChange } = props

  return (
    <SafeAreaView style={styles.container}>
      <Button key={close} style={styles.close} onPress={() => close(props.componentId)} >
        <Icon name="ios-close" color={colors.white} size={50}></Icon>
      </Button>
      <ScrollView>
        {genres && genres.map((g, i) => renderItem(g, i, props.componentId, onChange))}
      </ScrollView>
    </SafeAreaView>
  )
}

GenreModal.componentName = `GenreModal`

export default GenreModal

const renderItem = (g,i, componentId, onChange) => {

  return (
    <TouchableHighlight key={i.toString()} onPress={() => goToGenre(componentId, g.id, onChange)} >
      <View style={styles.options}>
        <Text style={theme.Heading}>{g.name}</Text>
      </View>
    </TouchableHighlight>
  )
}

const close = (componentId) => {
  Navigation.dismissModal(componentId)
}

const goToGenre = (componentId, id, onChange) => {
  Navigation.dismissModal(componentId)
  onChange(id)
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,

  },
  options: {
    height: 60,
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `center`,
  },
  close: {
    position: `absolute`,
    top: 30,
    right: 0,
  }
})
