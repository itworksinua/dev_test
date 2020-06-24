import * as React from "react"
import { View, Text, TextInput, StyleSheet, Image, ScrollView } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from 'react-native-button'
import DropdownAlert from 'react-native-dropdownalert'
import DeviceInfo from "react-native-device-info"
import { observer, inject } from "mobx-react"
import { getWpWithMax, addOrientationListener, removeOrientationListener } from '../manager/screen'
import { get } from 'lodash'

import { SessionStorage } from 'chowchow/src/lib/Storage'
import { goToApp } from 'chowchow/src/navigation'
import { updateConfigFromDomain } from 'chowchow/src/manager/chipmunk'
import { localize } from "../locale"
import theme from "../theme"
import colors from "../theme/colors"
import { getLogoByDomain } from "../theme/assets"
import { IStore } from "../store"

interface ILoginScreenProps extends React.Props<LoginScreen> {
  componentId: string;
  store: IStore;
}

interface ILoginScreenState {
  domain: string;
  email: string;
  password: string;
}

@inject((store: any) => ({ ...store }))

@observer
class LoginScreen extends React.Component<ILoginScreenProps, ILoginScreenState > {

  public static componentName = `LoginScreen`

  private dropdown: any
  /**
   *
   * @param props
   */
  public constructor(props: ILoginScreenProps) {
    super(props)
    this.state = {
      domain: ``,
      email: ``,
      password: ``,
    }
    this.handleClick = this.handleClick.bind(this)
    this.onChangeDomain = this.onChangeDomain.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
  }

  public async componentDidMount() {
    addOrientationListener(this)

    const { session: sessionStore } = this.props.store

    const domain = await SessionStorage.getDomain()
    const session = await SessionStorage.getSession()
    const email = get(session, 'user.email', '')
    this.setState({ email, domain })

    updateConfigFromDomain(domain)

    const reauthenticated = await sessionStore.reauthenticate()
    if (reauthenticated) goToApp()
  }

  public componentWillUnmount() {
    removeOrientationListener()
  }

  public render() {
    const { email, password, domain } = this.state
    const bundleId = DeviceInfo.getBundleId()
    const version  = DeviceInfo.getVersion()
    const buildNumber = DeviceInfo.getBuildNumber()
    const str = `${bundleId} - ${version} (${buildNumber})`

    const containerStyle = {
      width: getWpWithMax(`80%`, 600),
    }

    return (
      <ScrollView contentContainerStyle={[theme.Page, theme.PageCenterContent]}>

        <DropdownAlert
          updateStatusBar={false}
          successColor={colors.Success}
          errorColor={colors.Error}
          ref={ref => this.dropdown = ref}
        />
        <KeyboardAwareScrollView>
          <View style={containerStyle}>

            <Image
              source={getLogoByDomain(domain)}
              style={theme.Logo}
              resizeMode="contain"/>

            <Text style={theme.InputLabel}>{localize(`login:title:domain`).toUpperCase()}</Text>
            <TextInput
              style={theme.Input}
              textContentType={`URL`}
              placeholder={`https://mydomain.com`}
              placeholderTextColor={colors.InputPlaceholder}
              onChangeText={this.onChangeDomain}
              value={domain}
              autoCapitalize={`none`}
              autoCorrect={false}
            />

            <Text style={theme.InputLabel}>{localize(`login:title:email`).toUpperCase()}</Text>
            <TextInput
              style={theme.Input}
              textContentType={`emailAddress`}
              placeholder={`Email Address`}
              placeholderTextColor={colors.InputPlaceholder}
              onChangeText={this.onChangeEmail}
              value={email}
              autoCapitalize={`none`}
              autoCorrect={false}
            />

            <Text style={theme.InputLabel}>{localize(`login:title:password`).toUpperCase()}</Text>

            <TextInput
              style={theme.Input}
              textContentType={`password`}
              secureTextEntry={true}
              placeholder={`Password`}
              placeholderTextColor={colors.InputPlaceholder}
              onChangeText={this.onChangePassword}
              value={password}
              autoCapitalize={`none`}
              autoCorrect={false}
            />

            <Button
              containerStyle={[theme.ButtonContainer, styles.button,]}
              style={theme.ButtonText}
              onPress={this.handleClick}
            >
                        Log in
            </Button>
            <Text style={styles.appDetails}>{str}</Text>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    )
  }

  private onChangePassword(password: string): void {
    this.setState({ password  })
  }

  private onChangeEmail(email: string): void {
    this.setState({ email })
  }

  private onChangeDomain(domain: string): void {
    this.setState({ domain })
    updateConfigFromDomain(domain)
  }

  private async handleClick(): Promise<void> {
    const { email, password, domain } = this.state
    const { session: sessionStore } = this.props.store

    try {
      await sessionStore.authenticate(email, password, domain)
      goToApp()
    } catch (error) {

      const errorMessage = get(error, 'object.description', localize(`login:failure:subtitle`))

      this.dropdown.alertWithType(`error`, `Error`, errorMessage)
    }
  }

}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
  appDetails: {
    ...theme.AppDetails,
    marginTop: 30
  }

})

export default LoginScreen
