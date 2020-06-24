import * as React from 'react'
import { get } from 'lodash'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { Text } from 'react-native-elements'

interface IIconData {
  name: string;
  size: number;
  color: string;
  selectedColor: string;
}

interface ILineData {
  height: number;
  color: string;
}

interface ILabelData {
  name: string;
  icon?: IIconData;
  line?: ILineData;
}

interface IDotPagerProps extends React.Props<DotPager> {
  data: ILabelData[];
  selectedItem: ILabelData;
  containerStyle?: any;
  labelContainerStyle?: any;
  labelStyle: any;
  selectedLabelStyle: any;

  onPress: (index: any ) => void;
}

export default class DotPager extends React.Component<IDotPagerProps>  {

  public render() {
    const  { data, onPress, labelContainerStyle, labelStyle, selectedLabelStyle, selectedItem } = this.props

    const labelViews = data.map((item, i) => {
      const isSelected = !!(get(item, 'name', 'x') === get(selectedItem, 'name', 'y'))
      const style = isSelected ? [labelStyle, selectedLabelStyle] : labelStyle

      const tabStyle = (!isSelected)
        ? labelContainerStyle
        : {
          ...labelContainerStyle,
          borderBottomWidth: 1,
          borderBottomColor: 'red',
        }

      return (
        <TouchableOpacity key={i} onPress={() => onPress(item)} >
          <View style={tabStyle}>
            <Text style={style}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={this.props.containerStyle}
      >
        {labelViews}
      </ScrollView>
    )
  }

}
