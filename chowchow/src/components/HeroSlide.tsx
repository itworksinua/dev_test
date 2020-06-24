import * as React from 'react'
import { get } from 'lodash'
import { Image, View, StyleSheet, Text, TouchableHighlight } from "react-native"
import HeroTopShadow from 'chowchow/assets/images/hero-top-shadow.png'
import HeroBottomShadow from 'chowchow/assets/images/hero-bottom-shadow.png'
import theme from '../theme'
import { ISlimProduct } from '../lib/interfaces'
import ThumborImage from './ThumborImage'

interface HeroSlideProps {
  index: number;
  product: ISlimProduct;
  category?: any;
  containerStyle: any;
  onPress: (product: ISlimProduct) => {};
}

const getSubtitle = (category, product) => {
  const detailArray = []

  if (category) detailArray.push(category.name)
  if (get(product, `default_layer.year_of_production`)) detailArray.push(get(product, `default_layer.year_of_production`))

  return detailArray.join(` | `)
}

const HeroSlide = (props: HeroSlideProps) => {
  return(
    <TouchableHighlight onPress={() => props.onPress(props.product)} >
      <View style={props.containerStyle}>

        <ThumborImage image={props.product.preview_image} imageStyle={styles.image}/>
        {/* <Image source={HeroTopShadow} style={styles.topShadow} resizeMode={`stretch`}/> */}
        <Image source={HeroBottomShadow} style={styles.bottomShadow} resizeMode={`stretch`}/>

        <View style={styles.text}>
          <Text style={styles.category} >{props.category && props.category.name}</Text>
          <Text style={styles.title} >{props.product.title}</Text>
          <Text style={styles.subtitle} >{getSubtitle(props.category, props.product)}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default HeroSlide

const styles = StyleSheet.create({

  topShadow: {
    position: `absolute`,
    width: `100%`
  },
  bottomShadow: {
    position: `absolute`,
    width: `100%`,
    height: `100%`
  },

  image: {
    position: `absolute`,
    width: `100%`,
    height: `100%`
  },

  text: {
    position: `absolute`,
    bottom: 30,
    left: 18
  },
  category: {
    ...theme.HeroCategory,
    // fontSize: 12
  },
  title: {
    ...theme.HeroTitle
  },
  subtitle: {
    ...theme.HeroSubtitle,
    // fontSize: 12
  }
})
