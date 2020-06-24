import { StyleSheet,  } from "react-native"
import colors from "chowchow/src/theme/colors"
import theme from "chowchow/src/theme"

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: `column`,
    alignItems: `center`,
    backgroundColor: colors.Background,
  },
  genreHeader: {
    position: `absolute`,
    width: `100%`,
    color: `#fff`,
    flexDirection: `row`,
    flexWrap:`wrap`,
    justifyContent: `space-between`,
    zIndex: 999,
    marginTop: 50,
    marginLeft: 20
  },
  genreHeaderIcon: {
    color: `white`,
    marginTop: 5,
    width: 70
  },
  genreButton: {
    backgroundColor: `transparent`,
    marginRight: 200
  },
  genreButtonTitle: {
    fontWeight: `bold`,
    fontSize: 20,
    marginRight: 5,
  },
  title: {
    color: `#fff`,
    fontSize: 20,
    fontWeight: `bold`,
  },
  heroSlider: {
    height: 300,
  },
  heroSlide: {
    height: 300,
    // backgroundColor: `blue`,
  },
  subGenres: {
    height: 50,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  listStyle: {
    ...theme.HeadingTwo,
    marginRight: 15,
    marginLeft: 15,
    opacity: 0.7
  }
})
