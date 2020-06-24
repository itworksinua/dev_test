import colors from "../theme/colors"
import theme from "../theme"

export default {
  bottomTabs: {
    visible: true,
    drawBehind: false,
    backgroundColor: colors.TopBar,
    
  },
  bottomTab: {
    textColor: colors.Tab,
    iconColor: colors.Tab,
    selectedTextColor: colors.SelectedTab,
    selectedIconColor: colors.SelectedTab,
    badgeColor: colors.Primary
  },  
  topBar: {
    background: {
      color: colors.TopBar,
    },
    title: {
      ...theme.PageTitle
      
    },
    backButton: {
      color: theme.PageTitle.color,
    },

  },
  layout: {
    backgroundColor: colors.Background,
  },
}