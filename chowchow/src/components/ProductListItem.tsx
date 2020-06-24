import * as React from 'react'
import { TouchableOpacity, Text, View, StyleSheet, } from 'react-native'
import { compact } from 'lodash'
import colors from 'chowchow/src/theme/colors'
import theme from 'chowchow/src/theme'
import ThumborImage from 'chowchow/src/components/ThumborImage'
import { getVideoDimensions } from '../manager/screen'
import { IPreviewImage } from '../lib/interfaces'

interface ProductListItemProps {
  productId: number;
  image: IPreviewImage;
  name: string;
  year?: string;
  duration?: string;
  onPressItem: (id: number) => void;
  screenWidth: number;
  numColumns: number;
}

const ITEM_MARGIN = 10
const ITEM_DETAIL_HEIGHT = 65
let itemHeight = 1

const ProductListItem = (props: ProductListItemProps) => {

  const { screenWidth, numColumns, productId, image, name, onPressItem, duration, year } = props
  const videoDimensions = getVideoDimensions(screenWidth, ProductListItem.ITEM_MARGIN, numColumns)
  const detailsHeight = ITEM_DETAIL_HEIGHT + ITEM_MARGIN

  itemHeight = videoDimensions.height + detailsHeight

  const itemStyle = {
    marginLeft: ITEM_MARGIN/2,
    marginBottom: ITEM_MARGIN/2,
    
    width: videoDimensions.width,
    height: videoDimensions.height + detailsHeight,
  }

  const detailsStyle = {
    ...styles.details,
    height: detailsHeight
  }

  const formattedDuration = (duration) ? `${duration} mins`: null
  const meta = compact([year, formattedDuration]).join(` | `)

  return (
    <View style={[itemStyle, styles.cell]}>
      <TouchableOpacity 
        onPress={() => onPressItem(productId)} 
        delayPressIn={50}
      >
        <View style={styles.container}>

          <View style={[styles.preview, videoDimensions]}>
            <ThumborImage imageStyle={styles.image} image={image} />
          </View>

          <View style={detailsStyle}>
            <Text
              style={styles.title}
              numberOfLines={2}
              ellipsizeMode={`tail`}
            >
              {name}
            </Text>
            <Text
              style={styles.metadata}
              numberOfLines={1}
              ellipsizeMode={`tail`}
            >
              { meta }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
  
}

ProductListItem.ITEM_MARGIN = ITEM_MARGIN
ProductListItem.ITEM_DETAIL_HEIGHT = ITEM_DETAIL_HEIGHT

ProductListItem.getItemLayout = (index) => {
  return {
    length: itemHeight,
    offset: itemHeight * index,
    index,
  } 
}

export default ProductListItem

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.SecondaryBackground,
    overflow: `hidden`,
  },
  container: {
    flexDirection: `column`,
  },
  title: {
    ...theme.ItemHeading,
  },
  metadata: {
    ...theme.MetaDetail
  },
  image: {
    flex: 1,
  },
  details: {
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent:`center`
  },
  preview: {
    backgroundColor: colors.ImagePlaceholder,
    height: 150,
  },

})
