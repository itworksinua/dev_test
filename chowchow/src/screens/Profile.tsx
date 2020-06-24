import * as React from "react"
import { observer, inject } from "mobx-react"
import { isEmpty, get } from 'lodash'
import { View, SectionList, TouchableOpacity, Switch, StyleSheet, Text } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import DeviceInfo from "react-native-device-info"
import { IStore } from "../store"
import { localize } from "../locale"
import NetworkStore from "../store/networkStore"
import SessionStore from "../store/sessionStore"
import ProfileStore from '../store/profileStore'
import DownloadStore from "../store/downloadStore"
import theme from "../theme"
import colors from "../theme/colors"
import { gutter } from "../theme/theme"

interface IProfileScreenProps extends React.Props<ProfileScreen> {
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
class ProfileScreen extends React.Component<IProfileScreenProps> {

  public static componentName = `ProfileScreen`

  public static options = () => {
    return {
      topBar: {
        title: {
          text: localize(`profile:title`)
        },
      }
    }
  }

  public componentWillMount() {
    const { session: sessionStore, network: { connected } } = this.props
    const organizationId = get(sessionStore, 'session.organization.id')
    if (!organizationId) return

    if (connected) this.props.profileStore.getCompany(organizationId)
  }

  public render() {
    const { session: { session }, profileStore: { company }, network: { connected } } = this.props

    const FirstName = get(session, 'user.first_name', '')
    const LastName =  get(session, 'user.last_name', '')
    const Email =     get(session, 'user.email', '')
    const JobTitle =  get(session, 'user.function', '')
    const Company =   get(company, 'name', '')
    const FormOfOrg = get(company, 'legal_entity', '')
    const Street =    get(company, 'addresses[0].street', '')
    const City =      get(company, 'addresses[0].city', '')
    const ZipCode =   get(company, 'addresses[0].zip_code', '')
    const Country =   get(company, 'addresses[0].country.name', '')
    const Phone =     get(company, 'phones[0].number', '')

    const section = [
      {
        title: localize(`settings:title:user`),
        data: [
          {
            title: `First Name`,
            value:  `${FirstName}`,
          },
          {
            title: `Last Name`,
            value: `${LastName}`,
          },
          {
            title: `Email`,
            value: `${Email}`,
          },
          {
            title: `Job Title`,
            value: `${JobTitle}`,
          },
        ],
      },
    ]

    if (connected) {
      section.push({
        title: localize(`settings:title:company`),
        data: [
          {
            title: `Company`,
            value: `${Company}`,
          },
          {
            title: `Form of Organization`,
            value: `${FormOfOrg}`,
          },
          {
            title: `Street`,
            value: `${Street}`,
          },
          {
            title: `ZipCode`,
            value: `${ZipCode}`,
          },
          {
            title: `City`,
            value: `${City}`,
          },
          {
            title: `Country`,
            value: `${Country}`,
          },
          {
            title: `Phone`,
            value: `${Phone}`,
          },
        ],
      })
    }

    return (
      <View style={[theme.Page,]}>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
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

  private renderItem = ({ item, index, section }) => {

    const { action, data } = item

    if (action === undefined) {
      return (
        <View style={theme.SettingsRow}>
          <Text style={theme.ProfileLabel}>{item.title}:</Text>
          <Text style={theme.ProfileValue}>{item.value}</Text>
        </View>
      )
    }

    if (data !== undefined ) {
      return (
        <View style={theme.SettingsRow}>
          <Text style={theme.ProfileLabel} key={index}>{item.title}</Text>
          <Switch style={styles.switch} value={data} onValueChange={item.action}/>
        </View>
      )
    }

    return (
      <TouchableOpacity onPress={item.action} >
        <View style={theme.SettingsRow}>
          <Text style={theme.ProfileLabel} key={index}>{item.title}</Text>
          <Icon name={`ios-arrow-forward`} style={styles.icon} size={15} color={colors.TextMuted}/>
        </View>
      </TouchableOpacity>
    )
  }

  private keyExtractor = (item, index) => item + index

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

export default ProfileScreen
