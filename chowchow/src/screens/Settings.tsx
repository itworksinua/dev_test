import * as React from "react"
import { observer, inject } from "mobx-react"
import { View, SectionList, TouchableOpacity, Switch, StyleSheet, Text } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import DeviceInfo from "react-native-device-info"
import { crashlytics } from "../manager/firebase"
import { IStore } from "../store"
import { localize } from "../locale"
import NetworkStore from "../store/networkStore"
import SessionStore from "../store/sessionStore"
import ProfileStore from '../store/profileStore'
import DownloadStore from "../store/downloadStore"
import theme from "../theme"
import colors from "../theme/colors"
import { gutter } from "../theme/theme"

interface ISettingsScreenProps extends React.Props<SettingsScreen> {
  componentId: string;
  network: NetworkStore;
  session: SessionStore;
  download: DownloadStore;
  profileStore: ProfileStore;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { network, session, download, profileStore } = store

  const res = {
    network,
    session,
    download,
    profileStore
  }

  return res
})

@observer
class SettingsScreen extends React.Component<ISettingsScreenProps> {

  public static componentName = `SettingsScreen`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`settings:title`)
        },
      }
    }
  }

  public constructor(props: ISettingsScreenProps) {
    super(props)

    this.toggleOffline = this.toggleOffline.bind(this)
    this.toggleDownloadOnWifiOnly = this.toggleDownloadOnWifiOnly.bind(this)
    this.performCrash = this.performCrash.bind(this)

    // const { organization } = this.props.session.session

    // this.props.profileStore.getCompany(organization.id)
  }

  public render() {
    const section = [

      {
        title: localize(`settings:title:app_settings`),
        data: [
          {
            title: localize(`settings:title:force_offline`),
            action: this.toggleOffline,
            data: this.props.network.intentionallyTurnedOff
          },
          {
            title: localize(`settings:title:download_on_wifi_only`),
            action: this.toggleDownloadOnWifiOnly,
            data: this.props.download.downloadOnlyOnWifi
          },
        ],
      }
    ]

    return (
      <View style={[theme.Page,]}>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListFooterComponent={this.renderListFooter}
          sections={section}
          keyExtractor={this.keyExtractor}
          stickySectionHeadersEnabled={false}
        />
      </View>
    )
  }

  private renderSectionHeader = ({ section }) => {
    const { title } = section

    return (
      <View style={theme.SectionHeader}>
        <Text style={theme.MetaHeading}>{title}</Text>
      </View>
    )
  }

  private renderListFooter = () => {

    const bundleId = DeviceInfo.getBundleId()
    const version  = DeviceInfo.getVersion()
    const buildNumber = DeviceInfo.getBuildNumber()
    const str = `${bundleId} - ${version} (${buildNumber})`

    return (
      <Text style={theme.AppDetails}>{str}</Text>
    )
  }

  private renderItem = ({ item, index, section }) => {

    const { action, data } = item

    if (action === undefined) {
      return (
        <View style={theme.SettingsRow}>
          <Text style={theme.SettingsLabel} key={index}>{item.title}: <Text style={{ fontWeight: `bold` }}>{item.value}</Text></Text>
        </View>
      )
    }

    if (data !== undefined ) {
      return (
        <View style={theme.SettingsRow}>
          <Text style={theme.SettingsLabel} key={index}>{item.title}</Text>
          <Switch style={styles.switch} value={data} onValueChange={item.action}/>
        </View>
      )
    }

    return (
      <TouchableOpacity onPress={item.action} >
        <View style={theme.SettingsRow}>
          <Text style={theme.SettingsLabel} key={index}>{item.title}</Text>
          <Icon name={`ios-arrow-forward`} style={styles.icon} size={15} color={colors.TextMuted}/>
        </View>
      </TouchableOpacity>
    )
  }

  private keyExtractor = (item, index) => item + index

  private toggleOffline(value: boolean): void {
    this.props.network.setConnectivity(value)
  }

  private toggleDownloadOnWifiOnly(value: boolean): void {
    this.props.download.setDownloadsVideosViaWifiOnly(value)
  }

  private performCrash() {
    crashlytics.crash()
  }

}

const styles = StyleSheet.create({
  switch: {
    marginTop: 8
  },
  icon: {
    marginRight: gutter,
    marginTop: 17
  }
})

export default SettingsScreen
