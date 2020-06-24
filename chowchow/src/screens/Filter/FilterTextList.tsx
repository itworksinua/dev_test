import * as React from "react"
import { View, Text, FlatList, StyleSheet } from "react-native"
import {reduce, map, filter, includes, find, each} from 'lodash'
import {Button} from 'react-native-elements'
import colors from "../../theme/colors"
import Icon from "react-native-vector-icons/Ionicons"
import theme from "../../theme"

interface IFilterTextListProps {
  label: string;
  data: any[];
  containerStyle: any;
  labelStyle: any;
  aggregation?: any;
  onChange: (values) => void;
  loadMore?: () => void
  footerLabel?: string
}

const FilterTextList = (props: IFilterTextListProps) => {
  return (
    <View style={props.containerStyle}>
      <Text style={props.labelStyle}>{props.label}</Text>

      { props.label === 'LANGUAGES' ? languageFilter(props) : runtimeFilter(props) }
    </View>
  )
}

export default FilterTextList

const languageFilter = (props) => {
  const languages = reduce(props.data, function(result, item, key) {
    const a = find(props.aggregation, {value: item.id})
    if (a) {
      item.count = a['count']
      result.push(item)
    }
    return result;
  }, []);

  return (
    <FlatList
      data={languages}
      renderItem={({item}) =>
      <Text style={[languages.length > 1 ? { color: 'white' } : { color: 'grey' }]}
        onPress={() => languages.length > 1 ? props.onChange(item) : ''}>{item.display_title} - {item.count}</Text>}
      ListFooterComponent={() => languages.length > 5 ? renderFooter(props) : renderEmpty()}
    />
  )
}

const runtimeFilter = (props) => {
  const runtimes = reduce(props.data, (result, item, key) => {
    item.count = 0
    each(props.aggregation, (a) => {
      if (item.min <= a.value && a.value <= item.max) {
        item.count += a.count
      }
    })

    if (item.count > 0) result.push(item)
    return result;
  }, []);

  return (
    <FlatList
      data={runtimes}
      renderItem={({item}) => <Text style={{...props.labelStyle, color: `white`}} onPress={() => runtimes.length > 1 ? props.onChange([item.min, item.max]) : ''}>{item.label} - {item.count}</Text>}
    />
  )
}

const renderFooter = (props) => {
  return (
    <Button
      title={props.footerLabel}
      titleStyle={{fontSize: 12}}
      buttonStyle={{backgroundColor: `#323338`}}
      onPress={props.loadMore} />
  )
}

const renderEmpty = () => {
  return (
    <Text></Text>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: `black`,
    color: `white`
  }
})
