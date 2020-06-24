import * as React from 'react'
// import Button from 'react-native-button'
import { debounce } from 'lodash'
import { SearchBar } from 'react-native-elements'
import { localize } from '../locale'

import theme from '../theme'
import colors from '../theme/colors'
import { View, StyleSheet } from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'

interface ISearchTopBar extends React.Props<SearchTopBar> {
  search?: string;
  style?: any;
  onSearchChange: (term: string) => void;
}

export default class SearchTopBar extends React.Component<ISearchTopBar>  {

  private searchBar: SearchBar|undefined
  private startSearch: Function|undefined

  public constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.startSearch = debounce(props.onSearchChange, 500)
  }

  public state = {
    search: ``,
  }

  // public static getDerivedStateFromProps(props, state){

  //   return {
  //     search: props.search
  //   }
  // }

  public render() {

    // console.log(this.state)

    return (
      <View style={styles.container}>
        <SearchBar
          platform={`ios`}
          keyboardAppearance={`dark`}
          placeholder={localize(`search:placeholder`)}
          onChangeText={this.onChange}
          value={this.state.search}
          containerStyle={theme.SearchContainer}
          inputContainerStyle={theme.SearchInputContainer}
          inputStyle={theme.SearchInput}
          cancelButtonProps={{
            color: colors.Primary
          }}
          onCancel={this.clear}
          ref ={c => this.searchBar = c}
        />
        {/* <Button>
          <Icon name={`ios-funnel`} color={colors.Primary} size={30}/>
        </Button> */}
      </View>
    )
  }

  public clear() {
    if (this.searchBar){
      this.searchBar.clear()
    }
  }

  public focus(){
    if (this.searchBar){
      this.searchBar.focus()
    }
  }

  private onChange(term) {
    this.setState({ search: term })
    this.startSearch(term)
  }

}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: `blue`,
    flexDirection: `row`,
    justifyContent: `space-between`
  }
})
