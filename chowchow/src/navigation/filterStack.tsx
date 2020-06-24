import Filter from '../screens/Filter'
import { Navigation } from 'react-native-navigation'
import { localize } from '../locale'
import { getIcon } from '../manager/icons'

const filterStack = () => {
  return {
    // stack: {
    //   children: [
    //     {
    component: {
      name: Filter.componentName,
      options: {
        topBar: {
          visible: true,
          title: {
            text: localize(`Filter`)
          },
          leftButtons: [
            {
              id: `close-filter-btn`,
              icon: getIcon(`ios-close`)
            }
          ],
          rightButtons: [
            {
              id: `clear-filter-btn`,
              text: `Clear All`
            }
          ],
        },
        layout: {
          backgroundColor: `transparent`,
        },
      },
    }
  }
}

/**
 * Filter modal methods
 */
let filterId = null

export const showFilter = async () => {

  if (filterId) return

  const id = await Navigation.showOverlay(filterStack() as any)

  filterId = id
}

export const hideFilter = () => {

  if (!filterId) return

  Navigation.dismissOverlay(filterId)

  filterId = null
}

// export default filterStack
