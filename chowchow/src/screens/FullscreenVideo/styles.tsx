import { StyleSheet } from "react-native"

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: `center`,
    justifyContent: `center` ,
    backgroundColor: `black`
  },
  container: {
    backgroundColor: `black`,
    alignSelf: `stretch`,
  },
  cover: {
    flex: 1,
    backgroundColor: `black`,
    position: `absolute`,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  }
})