import { observable, action, } from 'mobx'
import { Dimensions } from 'react-native'

const initialWidth = Dimensions.get(`window`).width
const initialHeight = Dimensions.get(`window`).height

export default class OrientationStore {

    @observable public numberOfListColumns = 1
    @observable public numberOfContentColumns = 1
    @observable public orientation = `portrait`
    @observable public screenWidth = initialWidth
    @observable public screenHeight = initialHeight

    public constructor() {
      this.orientation = this.screenWidth < this.screenHeight ? `portrait` : `landscape`
      this.numberOfListColumns = getNumberOfListColumns(this.screenWidth)
      this.numberOfContentColumns = getNumberOfContentColumns(this.screenWidth)
    }

    @action.bound
    public listen(): void {
      Dimensions.addEventListener(`change`, newDimensions => {

        this.screenWidth = newDimensions.window.width
        this.screenHeight = newDimensions.window.height

        this.orientation = this.screenWidth < this.screenHeight ? `portrait` : `landscape`
        this.numberOfListColumns = getNumberOfListColumns(this.screenWidth)
        this.numberOfContentColumns = getNumberOfContentColumns(this.screenWidth)
      })
    }

}

const getNumberOfListColumns = (screenWidth: number) => {
  if (screenWidth <= 600) return 2
  if (screenWidth <= 1100) return 3
  return 4
}

const getNumberOfContentColumns = (screenWidth: number) => {
  if (screenWidth <= 600) return 1
  if (screenWidth <= 800) return 2
  return 3
}
