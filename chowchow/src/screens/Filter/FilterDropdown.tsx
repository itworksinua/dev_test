import * as React from "react"
import {map} from 'lodash'
import { View, Text, StyleSheet,  } from "react-native"
import RNPickerSelect from "react-native-picker-select"
import { Select } from "../../theme/theme"

interface IFilterDropdownProps {
  label: string;
  data: any[];
  selectedValue: string;
  containerStyle: any;
  labelStyle: any;
  onChange: (value: string, index: number) => void;
}

const FilterDropdown = (props: IFilterDropdownProps) => {
  return (
    <View style={props.containerStyle}>
      <Text style={props.labelStyle}>{props.label}</Text>

      <RNPickerSelect
        style={Select}
        items={props.data}
        onValueChange={(v,i) => onValueChange(props.onChange, v, i)}
        placeholder={{}}
        value={props.selectedValue}
      />
    </View>
  )
}

export default FilterDropdown

const onValueChange =(onChange, value: any, index: number) => {
  onChange(value, index)
}

const styles = StyleSheet.create({

})
