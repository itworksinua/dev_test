import * as React from "react"
import { View, Text, StyleSheet, } from "react-native"
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import colors from "../../theme/colors"
import { Slider } from "../../theme/theme"

interface ISelectedValue {
  min: number;
  max: number;
}

interface IFilterSliderProps {
  label: string;
  min: number;
  max: number;
  selectedValue: ISelectedValue;
  width: number;
  containerStyle: any;
  labelStyle: any;
  onChange: (min: number, max: number) => void;
}

const FilterSlider = (props: IFilterSliderProps) => {

  let { width } = props

  // calculate slider width - page margins - 2 halves of the handles
  width = width - (props.containerStyle.margin*2) - 20

  return (
    <View style={props.containerStyle}>
      <Text style={props.labelStyle}>{props.label}</Text>
      <View style={styles.container}>
        <MultiSlider

          trackStyle={Slider.track}
          selectedStyle={Slider.selected}
          unselectedStyle={Slider.unselected}
          min={props.min}
          max={props.max}
          onValuesChangeFinish={(v) => onValueChange(props.onChange, v)}
          values={[
            props.selectedValue.min,
            props.selectedValue.max,
          ]}
          sliderLength={width}
          step={1}
          // allowOverlap
          snapped
        />
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{props.selectedValue.min}</Text>
        <Text style={styles.rangeLabel}>{props.selectedValue.max}</Text>
      </View>
    </View>
  )
}

export default FilterSlider

const onValueChange =(onChange, value: any) => {
  const [min, max] = value

  onChange(min, max)
}

const styles = StyleSheet.create({
  container: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`
  },
  rangeLabels: {
    marginTop: 5,
    flexDirection: `row`,
    justifyContent: `space-between`
  },
  rangeLabel: {
    color: colors.TextGrey
  }
})
