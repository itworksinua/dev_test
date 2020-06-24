import * as React from "react"
import { StyleSheet, View, Platform, Image } from "react-native"
import Button from "react-native-button"
import Icon from "react-native-vector-icons/Ionicons"
import pencil from "../../assets/images/pencil.png"

interface IDeleteButtonProps {
  onClick: () => void;
  color: string;
}

class DeleteButton extends React.PureComponent <IDeleteButtonProps> {

  public render() {
    return (
      <Button onPress={this.props.onClick}>
        <View style={styles.container} >
          <Icon name="ios-close" size={30} color={this.props.color} />
        </View>
      </Button>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: `red`,
    marginRight: (Platform.OS === `android`) ? 0 : 0,
    width:80,
    height: 80,
    alignItems: `center`,
    justifyContent: `center`
  },
})

export default DeleteButton
