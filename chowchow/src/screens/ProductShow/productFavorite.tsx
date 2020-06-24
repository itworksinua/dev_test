import * as React from "react"
import Button from 'react-native-button'
import { favorite, unfavorite } from '../../lib/productApi'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../../theme/colors'
import styles from './styles'
import { localize } from "../../locale"
import { Text, View, StyleSheet } from "react-native"
import { gutter } from "../../theme/theme"

const FavoriteButton = (props: any, state: any) => {
  const { favorite: { isFavorite }, productId, onUpdate } = props

  return (
    <View>
      <Button
        containerStyle={styles.actionButton}
        onPress={() => favoriteProduct(productId, isFavorite, onUpdate)}
      >
        {getButtonContents(isFavorite)}
      </Button>
    </View>
  )
}

const getButtonContents = (isFavorite) => {

  const icon = (isFavorite) 
    ? `ios-star`
    : `ios-star-outline`
  
  const label =  (isFavorite) 
    ? localize(`favorites:button:remove`) 
    : localize(`favorites:button:add`)

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

const favoriteProduct = async (productId, isFavorite, onUpdate) => {
  if (isFavorite) {
    await unfavorite(productId)
    onUpdate({ isFavorite: false })
  } else {
    await favorite(productId)
    onUpdate({ isFavorite: true })
  }
}

const localStyle = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`
  }
})

export default FavoriteButton
