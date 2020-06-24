import { localize } from "../locale"
import { LayoutRoot } from "react-native-navigation"
import Home from "../screens/HomeScreen"
import SearchList from "../screens/SearchList"
import DownloadProductList from "../screens/DownloadProductList"
import PrivateScreen from "../screens/Private"
import SyncsListScreen from "../screens/SyncsList"

import CatalogueIcon from "chowchow/assets/images/catalogue.png"
import DownloadIcon from "chowchow/assets/images/download-box.png"
import PrivateIcon from "chowchow/assets/images/profile.png"
import SearchIcon from "chowchow/assets/images/search.png"

const tab1 = () => {
  return {
    stack: {
      children: [{
        component: {
          name: Home.componentName,
          options: {

            topBar: {
              // visible: true,
              // hideOnScroll: true,
              animate: true,
              title: {
                text: localize(`tab:catalogue`),
              },
              // drawBehind: true,
              background: {
                // translucent: true
              },
            },
            animations: {
              push: {
                enabled: false,
              },
            },
          },
        },
      }
      ],
      options: {
        bottomTab: {
          text: localize(`tab:catalogue`),
          icon: CatalogueIcon,
        }
      }
    }
  }
}

const tab2 = () => {
  return {
    stack: {
      children: [{
        component:{
          name: SearchList.componentName,
          options: {
            topBar: {
              visible: true,
              title: {
                text: localize(`tab:search`)
              },
              //rightButtons: [
                //{
                  //id: `show-filter-btn`,
                  //icon: getIcon(`ios-funnel`)
                //}
              //],
              // rightButtons: [
              //   {
              //     id: `clear-filter-btn`,
              //     icon: getIcon(`ios-funnel`)
              //   }
              // ],

            // searchBar: true, // iOS 11+ native UISearchBar inside topBar
            // searchBarHiddenWhenScrolling: true,
            // searchBarPlaceholder: `Search`, // iOS 11+ SearchBar placeholder
            }
          }
        }
      }
      ],
      options: {
        bottomTab: {
          text: localize(`tab:search`),
          icon: SearchIcon,
        }
      }
    }
  }
}

const tab3 = () => {
  return {
    stack: {
      children: [{
        component:{
          name: DownloadProductList.componentName,
          options: {
            topBar: {
              title: {
                text: localize(`tab:downloads`),
                alignment: `center`
              }
            }
          }
        }
      }
      ],
      options: {
        bottomTab: {
          text: localize(`tab:downloads`),
          icon: DownloadIcon,
        }
      }
    }
  }
}

const tab4 = () => {
  return {
    stack: {
      children: [{
        component:{
          name: SyncsListScreen.componentName,
          options: {
            topBar: {
              title: {
                text: localize(`tab:syncs`),
                alignment: `center`
              }
            }
          }
        }
      }
      ],
      options: {
        bottomTab: {
          text: localize(`tab:syncs`),
          icon: DownloadIcon,
        }
      }
    }
  }
}

const tab5 = () => {
  return {
    stack: {
      children: [
        {
          component:
          {
            name: PrivateScreen.componentName,
            options: {
              topBar: {
                title: {
                  text: localize(`tab:private`),
                  alignment: `center`
                }
              }
            }
          }
        }
      ],
      options: {
        bottomTab: {
          text: localize(`tab:private`),
          icon: PrivateIcon
        }
      }
    }
  }
}

const buildStack = () => {
  const stack = {
    root: {
      bottomTabs: {
        options: {

        },
        children: [
          tab1(),
          tab2(),
          tab3(),
          tab4(),
          tab5()
        ],
      }
    },
  }

  return stack as LayoutRoot
}

export default buildStack
