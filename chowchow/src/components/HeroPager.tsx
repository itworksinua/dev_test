import * as React from 'react'
import { View } from 'react-native'
import { ViewPager } from 'rn-viewpager'

export interface IHeroPageSelectedEvent {
  position: number;
  offset: number;
}

interface IHeroPagerProps extends React.Props<HeroPager> {
  selectedIndex: number;
  goToIndex: (event: IHeroPageSelectedEvent) => void;
  containerStyle: any;
}

export default class HeroPager extends React.Component<IHeroPagerProps>  {

  private pagerRef?: ViewPager|null = null

  public constructor(props: IHeroPagerProps){
    super(props)

    this.onPageSelected = this.onPageSelected.bind(this)
  }

  public render() {

    console.log(`render `, this.props.selectedIndex)

    return (
      <View style={this.props.containerStyle}>
        <ViewPager
          initialPage={ this.props.selectedIndex}
          ref={comp => this.pagerRef = comp}
          onPageSelected={this.onPageSelected}
          style={{ height:this.props.containerStyle.height }}
          
        >
          {this.props.children}
        </ViewPager>
      </View>
    )
  }

  public componentDidUpdate(prevProps: IHeroPagerProps) {

    if (this.pagerRef && prevProps.selectedIndex !== this.props.selectedIndex) {
      this.pagerRef.setPage(this.props.selectedIndex)
    }
  }

  private onPageSelected(e: any) {
    
    if (e.position < 0) return

    if (this.props.selectedIndex === e.position) return

    console.log(`goToIndex page `, this.props.selectedIndex, e.position)

    this.props.goToIndex(e)
  }

}
