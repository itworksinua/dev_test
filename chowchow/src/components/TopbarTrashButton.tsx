import * as React from "react"
import { StyleSheet, View, Platform, Image } from "react-native"
import Button from "react-native-button"
import Icon from "react-native-vector-icons/Ionicons"
import pencil from "../../assets/images/pencil.png"

interface ITopTrashButtonProps {
  onClick: () => {};
  color: string;
}

class TopbarTrashButton extends React.PureComponent <ITopTrashButtonProps> {

  public static componentName = `TopbarTrashButton`

  public render() {
    return (
      <Button onPress={this.props.onClick}>
        <View style={styles.container} >
          {/* <Icon name="ios-trash" size={30} color={this.props.color} /> */}
          <Image source={pencil} style={styles.icon}/>
        </View>
      </Button>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: `#333`,
    marginRight: (Platform.OS === `android`) ? 0 : 0,
    width:40,
    height: 40,
    alignItems: `center`,
    justifyContent: `center` 
  },
  icon: {
    width:20,
    height: 20,
  }
})

export default TopbarTrashButton
