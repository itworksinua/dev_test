import { init as initRouter } from "./navigation"
import { init as initIcons } from './manager/icons'
import { init as initLocales } from './locale'
//import { init as initFirebase } from './manager/firebase'
import store from './store'

//initFirebase()
initIcons()
initLocales()
initRouter()

store.orientation.listen()

console.disableYellowBox = true
