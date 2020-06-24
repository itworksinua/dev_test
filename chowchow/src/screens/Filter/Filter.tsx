import * as React from "react"
import { observer, inject } from "mobx-react"
import { toJS } from "mobx"
import { each, isEmpty, find } from 'lodash'
import { StyleSheet, ScrollView, SafeAreaView, View, TouchableWithoutFeedback } from "react-native"
import Button from "react-native-button"
import { Text } from "react-native-elements"
import { catDescendantIds } from "tuco/src/lib/helpers"

import * as Animatable from 'react-native-animatable'
import { IStore } from "../../store"
import { localize } from "../../locale"
import FilterDropdown from "./FilterDropdown"
import FilterList from "./FilterList"
import FilterSlider from "./FilterSlider"
import FilterTextList from "./FilterTextList"
import theme from "../../theme"
import OrientationStore from "../../store/orientationStore"
import ProductList from "../../store/productListStore"
import BasicsStore from '../../store/basicsStore'
import { hideFilter } from "../../navigation"
import { Navigation } from "react-native-navigation"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import colors from "../../theme/colors"

interface IFilterScreenProps extends React.Props<FilterScreen> {
  componentId: string;
  orientation: OrientationStore;
  productList: ProductList;
  basicsStore: BasicsStore;
}

const types = [
  { label: `All`,
    value: `All` },
  { label: `Episode`,
    value: `product/motion_picture/episode`,
    params: { only_roots: false } },
  { label: `Format`,
    value: `product/motion_picture/format`,
    params: { only_roots: true } },
  { label: `Program`,
    value: `product/motion_picture/program`,
    params: { only_roots: true } },
  { label: `Season`,
    value: `product/motion_picture/season`,
    params: { only_roots: false } },
  { label: `Series`,
    value: `product/motion_picture/series`,
    params: { only_roots: true } },
]

const years =  { min: 1983,
  max: 2019 }

const runtime = { min: 0,
  max: 30 }

const runtimes = [
  { id: 1,
    min: 0,
    max: 30,
    label: `0 - 30 minutes` },
  { id: 2,
    min: 31,
    max: 60,
    label: `31 - 60 minutes` },
  { id: 3,
    min: 61,
    max: 120,
    label: `61 - 120 minutes` },
  { id: 4,
    min: 120,
    max: 600,
    label: `120+ minutes` }
]

const fields = [
  { name: `type`,
    action: `eq`,
    params: { only_roots: true } },
  { name: `year_of_production`,
    action: `range` },
  { name: `duration`,
    action: `range` },
  { name: `language_versions.language_id`,
    action: `eq` }
]

const DRAW_PERCENT = 80

@inject((object: any) => {
  const store: IStore =  object.store

  return store
})
@observer
class FilterScreen extends React.Component<IFilterScreenProps> {

  public state = {
    selectedType: null,
    selectedYear: years,
    selectedRuntime: runtime,
    selectedGenre: null,
    selectedLanguage: null,
    languages: null,
    footerLabel: ``,
    ready: false,
    duration: 300,
    keyFrame: {} as any,
  }

  private navigationEventListener
  private drawRef

  public static componentName = `FilterScreen`

  public constructor(props) {
    super(props)

    this.onTypeChange = this.onTypeChange.bind(this)
    this.onYearChange = this.onYearChange.bind(this)
    this.onGenreChange = this.onGenreChange.bind(this)
    this.onRuntimeChange = this.onRuntimeChange.bind(this)
    this.onLanguageChange = this.onLanguageChange.bind(this)
    this.loadMore = this.loadMore.bind(this)

    this.props.basicsStore.loadBasics().then(() => {
      this.setState({ ready: true })
    })
    this.dismiss = this.dismiss.bind(this)
    this.swiping = this.swiping.bind(this)
    this.gestureChanges = this.gestureChanges.bind(this)

    const screenWidth = this.props.orientation.screenWidth

    this.state.keyFrame = {
      from: { translateX: screenWidth },
      to: { translateX: 0 },
    }
  }

  // public componentDidMount() {

  //   this.navigationEventListener = Navigation.events().bindComponent(this)
  // }

  public componentDidUpdate() {
    const { parametron } = this.props.productList.products
    const languages = toJS(this.props.basicsStore.languages)
    const numLanguages = languages ? (languages || []).length : 0

    if (!this.state.languages&& !isEmpty(languages)) {
      numLanguages > 5 ? this.setState({ footerLabel: `Load More`,
        languages: languages.slice(0, 5) }) : this.setState({ languages })
    }

    // update filters with their values
    each(fields, (f) => {
      const value = parametron.api.fetch(f.name, f.action)

      if (value && f.name === `type` && !this.state.selectedType)
        this.setState({ selectedType: value })
      else if (value && f.name === `year_of_production` && (value[0] !== this.state.selectedYear.min || value[1] !== this.state.selectedYear.max))
        this.setState({ selectedYear: { min: value[0] || years.min,
          max: value[1]|| years.max } })
      else if(value && f.name === `duration` && (value[0] !== this.state.selectedRuntime.min || value[1] !== this.state.selectedRuntime.max)) {
        this.setState({ selectedRuntime: { min: value[0] || runtime.min,
          max: value[1]|| runtime.max } })
      }
    })
  }

  // public componentWillUnmount() {
  //   if (this.navigationEventListener) {
  //     this.navigationEventListener.remove()
  //   }
  // }

  public navigationButtonPressed({ buttonId }) {
    switch (buttonId) {
      case `close-filter-btn`:
        hideFilter()
        break
      case `clear-filter-btn`:
        this.clearAll()
        break
    }
  }

  // public componentWillUnmount() {
  //   if (this.navigationEventListener) {
  //     this.navigationEventListener.remove()
  //   }
  // }

  // public navigationButtonPressed({ buttonId }) {
  //   switch (buttonId) {
  //     case `close-filter-btn`:
  //       hideFilter()
  //       break
  //     case `clear-filter-btn`:
  //       alert(`clear the filters`)
  //       break
  //   }
  // }

  public render() {
    const categories = toJS(this.props.basicsStore.categories)
    const { data: { aggregations: { count_by_duration, count_by_language_id, count_by_category_ids } } } = this.props.productList.products.parametron

    const { keyFrame, duration } = this.state
    const screenWidth = this.props.orientation.screenWidth
    const drawWidth = screenWidth * (DRAW_PERCENT/100)

    const drawStyle = {
      ...styles.draw,
      width:`${DRAW_PERCENT}%`,
    }

    const outsideStyle = {
      ...styles.fill,
      width: `${100-DRAW_PERCENT}%`,
    }

    return (
      <PanGestureHandler
        onHandlerStateChange={this.gestureChanges}
        onGestureEvent={this.swiping}
        activeOffsetX={20}
      >

        <Animatable.View
          style={styles.containerStyle}
          useNativeDriver
          duration={duration}
          animation={keyFrame}
          ref={r => this.drawRef = r}
        >

          <View style={outsideStyle}>
            <TouchableWithoutFeedback onPress={() => this.dismiss()}>
              <View style={styles.fill}/>
            </TouchableWithoutFeedback>
          </View>

          <View style={drawStyle}>
            <ScrollView style={styles.fill}>

              <View style={[styles.buttonContainer]} >
                <Button onPress={() => this.dismiss()}>
                  <Text style={theme.Paragraph}>Done</Text>
                </Button>

                <Button onPress={this.clearAll}>
                  <Text style={theme.Paragraph}>Clear All</Text>
                </Button>
              </View>

              <View style={styles.horLine} />

              <FilterDropdown
                label={localize(`search:title:type`).toUpperCase()}
                data={types}
                selectedValue={this.state.selectedType}
                labelStyle={styles.filterLabels}
                containerStyle={styles.filterContainers}
                onChange={this.onTypeChange}
              />

              <View style={theme.HorizontalLine} />

              <FilterTextList
                label={localize(`search:title:runtime`).toUpperCase()}
                aggregation={count_by_duration}
                data={runtimes}
                labelStyle={styles.filterLabels}
                containerStyle={styles.filterContainers}
                onChange={this.onRuntimeChange}
              />

              <View style={styles.horLine} />

              <FilterSlider
                label={localize(`search:title:year_of_production`).toUpperCase()}
                min={years.min}
                max={years.max}
                selectedValue={this.state.selectedYear}
                labelStyle={styles.filterLabels}
                containerStyle={styles.filterContainers}
                onChange={this.onYearChange}
                width={drawWidth}
              />

              <View style={styles.horLine} />

              {this.state.ready &&
                <FilterList
                  label={localize(`search:title:genres`).toUpperCase()}
                  aggregation={count_by_category_ids}
                  data={categories}
                  labelStyle={styles.filterLabels}
                  containerStyle={styles.filterContainers}
                  onChange={this.onGenreChange}
                />}

              <View style={styles.horLine} />

              <FilterTextList
                label={localize(`search:title:languages`).toUpperCase()}
                aggregation={count_by_language_id}
                data={this.state.languages}
                labelStyle={styles.filterLabels}
                containerStyle={styles.filterContainers}
                loadMore={this.loadMore}
                footerLabel={this.state.footerLabel}
                onChange={this.onLanguageChange}
              />
            </ScrollView>
          </View>
        </Animatable.View>
      </PanGestureHandler>
    )
  }

  private onTypeChange(value: string, index: number) {
    const field = find(fields, { name: `type` })

    field.params = (find(types, { value })).params

    if (value === `All`)
      this.clear(field)
    else
      this.props.productList.filterByFieldName(field, value)

    this.setState({ selectedType: value })
  }

  private onRuntimeChange(values) {
    const field = find(fields, { name: `duration` })
    const [min, max] = values

    this.setState({ selectedRuntime: {
      min,
      max
    } })

    this.props.productList.filterByFieldName(field, [min, max])
  }

  private onYearChange(min: number, max: number) {
    const field = find(fields, { name: `year_of_production` })

    this.setState({ selectedYear: {
      min,
      max
    } })

    this.props.productList.filterByFieldName(field, [min, max])
  }

  private onGenreChange(genre, index?: number) {
    const categories = toJS(this.props.basicsStore.categories)
    const catIds = catDescendantIds(categories, genre)

    this.setState({ selectedGenre: genre.name })

    this.props.productList.filterByCategory(catIds)
  }

  private gestureChanges(e) {
    const event = e.nativeEvent

    if (event.state !== State.END) return

    const screenWidth = this.props.orientation.screenWidth

    if (event.translationX < (screenWidth * 0.5) ) {
      this.drawRef.transitionTo({ translateX: 0 }, 100)
    } else {
      this.dismiss(100, event.translationX)
    }

  }

  private swiping(e) {
    const event = e.nativeEvent

    if (event.translationX < 0) return

    this.drawRef.transitionTo({ translateX: event.translationX })
  }

  private dismiss(duration = 300, from = 0) {

    const screenWidth = this.props.orientation.screenWidth

    this.setState({
      keyFrame: {
        from: { translateX: from },
        to: { translateX: screenWidth },
      },
      duration: duration
    })

    setTimeout(hideFilter, duration)
  }

  private onLanguageChange(value) {
    this.setState({ selectedLanguage: value.id })
    const field = {
      name: `language_versions.language_id`,
      verb: `eq`
    }

    this.props.productList.filterByFieldName(field, value.id)
  }

  private loadMore() {
    const languages = toJS(this.props.basicsStore.languages)

    this.state.languages && this.state.languages.length > 5 ?
      this.setState({ footerLabel: `Load More`,
        languages: this.state.languages.slice(0, 5) }) : this.setState({ footerLabel: `Load Less`,
        languages })
  }

  private clear = (field) => {
    const { parametron } = this.props.productList.products

    parametron.api.clear(field.name, field.verb)
  }

  private clearAll = () => {
    this.props.productList.clearAll()
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: `row`,
    shadowColor: `#000`,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  filterContainers: {
    margin: 30,
    paddingTop: 0,
    paddingBottom: 0,
    // borderTopColor: colors.Hairline,
    // borderTopWidth: hairline
  },
  filterLabels: {
    ...theme.MetaDetail,
    marginBottom: 10,
  },
  fill: {
    flex: 1
  },
  horLine: {
    backgroundColor: `#444`,
    width: `100%`,
    height: 1,
    marginBottom: 0,
    marginTop: 0
  },
  buttonContainer: {
    margin: 30,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: `row`,
    justifyContent: `space-between`
  },
  draw: {
    backgroundColor: colors.SecondaryBackground,
  }
})

export default FilterScreen
