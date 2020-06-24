import * as React from "react"
import { View, Text, StyleSheet } from "react-native"
import {reduce, find, each, isEmpty, map, compact} from 'lodash'
import Accordion from 'react-native-collapsible/Accordion'
import colors from "../../theme/colors"
import Icon from "react-native-vector-icons/Ionicons"
import theme from "../../theme"

interface IFilterListData {
  name: string;
  id: number|string;
  count?: number;
  sub?: IFilterListData[];
  children?: any[]
}

interface IFilterListProps {
  label: string;
  data: IFilterListData[];
  containerStyle: any;
  labelStyle: any;
  onChange: (value) => void;
  aggregation?: any
}

class FilterList extends React.Component<IFilterListProps> {
  state = {
    activeSections: [],
    collapsed: true,
    multipleSelect: false,
    data: [],
  };

  public constructor(props) {
    super(props)
  }

  public componentDidMount() {
    each(this.props.data, (c) => {
      if (c.children) {
        each(c.children, (item) => {
          const a = find(this.props.aggregation, {value: item.id})
          if (a) item.count = a['count']
        })
      }
    })
  }

  public render() {
    return (
      <View style={this.props.containerStyle}>
        <Text style={this.props.labelStyle}>{this.props.label}</Text>

        <View style={styles.list}>
          <Accordion
            activeSections={this.state.activeSections}
            sections={this.props.data}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent}
            onChange={this.updateSections}
          />

        </View>
      </View>
    )
  }

  updateSections = (sections) => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  }

  renderHeader = (content: any, index: number, isActive: boolean, sections: string[]) => {

    const hasSubs = content.children && !isEmpty(content.children) && !isEmpty(compact(map(content.children, 'count')))

    return (
      <View key={index} style={styles.row}>
        <View style={styles.headerLabelContainer}>
          <Text style={styles.headerLabel} onPress={() => this.props.onChange(content)}>{content.name}</Text>
          { hasSubs &&<Icon name={`ios-arrow-dropdown`} color={`#fff`} size={20} /> }
        </View>
        <Text style={styles.itemCount}>{content.count}</Text>
      </View>
    )
  }

  renderContent = (content: any, index: number, isActive: boolean, sections: string[]) => {

    if (!content.children || !content.children.length) return null

    return content.children.map((subContent, i) => {
      if (!subContent.count) return

      return (
        <View key={i} style={styles.row}>
          <View style={styles.subLabelContainer}>
            <Text style={styles.subLabel} onPress={() => this.props.onChange(subContent)}>{subContent.name} - {subContent.count}</Text>
          </View>
          <Text style={styles.itemCount}>{content.count}</Text>
        </View>
      )
    })

  }
}

export default FilterList

const spacing = 7
const indent = 10

const styles = StyleSheet.create({
  list: {

  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`
  },
  headerLabelContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    // backgroundColor: `yellow`
  },
  headerLabel: {
    color: colors.TextGrey,
    marginTop: spacing,
    marginBottom: spacing,
    marginRight: 7,
  },
  itemCount: {
    ...theme.Paragraph
  },
  subLabelContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    // backgroundColor: `green`
  },
  subLabel: {
    color: colors.TextGrey,
    marginLeft: indent,
    marginTop: spacing,
    marginBottom: spacing,
  }

})
