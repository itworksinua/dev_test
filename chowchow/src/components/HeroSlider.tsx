import * as React from 'react'
import { View } from 'react-native'
import HeroSlide from './HeroSlide'
import HeroPager from './HeroPager'
import DotPager from './DotPager'

interface HeroSliderProps {
  products: any[]; 
  height: number;
  width: number;
  onPress: (i: number) => void;
}

const HeroSlider = (props: HeroSliderProps) => {

  const [index, setIndex] = React.useState(0)

  const { products, height, width, onPress } = props

  const slideStyle = {
    height,
    width, 
  }

  const heroSlides = buildSlides(products, slideStyle, onPress)

  return (

    <View>
      <HeroPager
        containerStyle={slideStyle}
        selectedIndex={index}
        goToIndex={e => setIndex(e.position)}
      >
        {heroSlides}
      </HeroPager>

      <DotPager 
        pageCount={heroSlides.length} 
        selectedIndex={index} 
        hideSingle={true} 
      />
    </View>

  )
}

const buildSlides = (heroProducts, heroSlideStyle, onPress) => {
  return heroProducts.map((item, i) => {
    const { product } = item
  
    return (
      <HeroSlide
        index={i}
        key={i}
        product={product}
        containerStyle={heroSlideStyle}
        onPress={() => onPress(product.id)}
      />
    )
  })
}

export default HeroSlider