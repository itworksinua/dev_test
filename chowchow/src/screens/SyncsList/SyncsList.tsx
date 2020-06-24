import * as React from "react"
import { get, map, each } from "lodash"
import { observer, inject } from "mobx-react"
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native"
import { Button } from 'react-native-elements'
import Icon from "react-native-vector-icons/Ionicons"

import {alertDownloadError} from 'chowchow/src/manager/alert'
import { GroupStorage } from 'chowchow/src/lib/Storage'
import { syncGroup, dropMetadataByGroupId } from 'chowchow/src/lib/sync'
import { pushGroup } from '../../navigation'
import { IStore } from "../../store"
import groupStore from '../../store/groupStore'
import theme from "../../theme"
import style from './styles'

interface ISyncsListScreenProps extends React.Props<SyncsListScreen> {
  componentId: string;
  group: groupStore;
}

interface ISyncsListScreenState {
  isRefreshing: boolean;
}

@inject((object: any) => {
  const store: IStore =  object.store
  const { group } = store

  const res = {
    group,
  }

  return res
})

@observer
class SyncsListScreen extends React.Component<ISyncsListScreenProps, ISyncsListScreenState> {

  public static componentName = `SyncsList`

  public state = {
    isRefreshing: false,
  }

  public constructor(props) {
    super(props)
    const { group } = this.props
    group.loadGroups()
  }

  componentDidMount = async() => {
    const syncedGroups = await GroupStorage.getAll()
    const { group: { groups } } = this.props
    const groupIds = map(groups, 'id')
    each(syncedGroups, (group) => {
      if(!groupIds.includes(group['id']))
        dropMetadataByGroupId(group['id'])
    })
  }

  public render() {
    const { group: { groups } } = this.props
    const dataLength = get(groups, `length`, 0)

    return (
      <SafeAreaView style={theme.Page}>
        <View style={[theme.Page]}>
          {dataLength > 0 && groups.map((g, index) => {
            return (
              <TouchableOpacity>
                <View style={theme.SettingsRow}>
                  <Text onPress={() => this.goToGroupPage(g.id)} style={style.label} key={index}>{g.name}</Text>

                  <Button
                    buttonStyle={style.badge}
                    onPress={() => this.triggerSync(g.id)}
                    icon={
                      <Icon
                        name='ios-sync'
                        size={18}
                        color="white"
                      />
                    }
                  />
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </SafeAreaView>
    )
  }

  private goToGroupPage(id: number) {
    pushGroup(this.props.componentId, id)
  }

  private triggerSync = async(id: number) => {
    try {
      await syncGroup(id)
    }
    catch(err) {
      alertDownloadError('Something went wrong!')
    }

    console.log('The sync proces was completed')
  }
}

export default SyncsListScreen
