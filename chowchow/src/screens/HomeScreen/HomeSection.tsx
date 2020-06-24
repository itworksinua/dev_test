import * as React from "react"
import { View, Text, StyleSheet } from "react-native"
import ThumbPager from 'chowchow/src/components/ThumbPager'
import Button from "react-native-button"
import { isEmpty } from 'lodash'
import Icon from "react-native-vector-icons/Ionicons"

interface HomeSectionProps {
  title: string;
  data: any[];
  sliderStyle: any;
  titleStyle: any;
  thumbStyle: any;
  thumbnailBarStyle: any;
  dimensions: any;
  titlePressed: () => void;
  itemPressed: (item: any) => void;
}

const HomeSection = (props: HomeSectionProps) => {
  return (
    <View>
      { !isEmpty(props.data)
      &&
      <View style={props.sliderStyle}>
        <Button onPress={() => props.titlePressed()}>
          <View style={styles.container}>
            <Text style={[props.titleStyle, styles.title]}>{props.title}</Text>
            <Icon
              style={styles.icon}
              name="ios-arrow-forward"
              size={13}
              color="white"
            />
          </View>
        </Button>
        <ThumbPager
          data={props.data}
          thumbStyle={props.thumbStyle}
          containerStyle={props.thumbnailBarStyle}
          thumbDimensions={props.dimensions}
          margin={5}
          padding={10}
          fillWithPlaceholders={true}
          onPress={(e) => props.itemPressed(props.data[e.position])}
        />
      </View>
      }
    </View>
  )
}

export default HomeSection

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`
  },
  title: {
    marginRight: 5
  },
  icon: {
    marginTop: 4
  }

})
