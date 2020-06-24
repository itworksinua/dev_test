import { Navigation } from "react-native-navigation"

export const spinnerName = `Spinner`

const spinnerStack = {
  component: {
    name: spinnerName,
    options: {
      overlay: {
        interceptTouchOutside: false,
      },
      layout: {
        backgroundColor: `transparent`,
      }
    }
  },
  
}

let spinnerId = null

export const showSpinner = async () => {

  if (spinnerId) return

  const id = await Navigation.showOverlay(spinnerStack)

  spinnerId = id

}

export const hideSpinner = async () => {

  if (!spinnerId) return

  await Navigation.dismissOverlay(spinnerId)

  spinnerId = null
}