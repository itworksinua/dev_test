import * as React from 'react'
import { get } from 'lodash'
import { StyleSheet, View, Text } from 'react-native'
import colors from '../theme/colors'
import theme from '../theme'
import { formatFileSize } from '../manager/filesize'
import { localize } from '../locale'

interface IDownloadStateViewProps extends React.Props<DownloadStateView> {
  state: any;
  used: number;
  free: number;
}

export default class DownloadStateView extends React.Component<IDownloadStateViewProps>  {

  public render() {

    const state = this.props.state
    const used = this.props.used
    const remaining = this.props.free

    const currentRemaining = (!isNaN(used)) ? remaining - used : remaining
    
    const formattedSpace = `${formatFileSize(currentRemaining)}`
    const availableSpace = localize(`downloadstate:available:space`, { space: formattedSpace })

    const inQueue = get(state,`inQueue`,0)
    const inProgress = get(state,`inProgress`,0)
    const complete = get(state,`complete`,0)
    const downloading = inProgress + inQueue

    const downloadedStr = (complete)
      ? localize(`downloadstate:downloaded:count`,{ smart_count: complete })
      : localize(`downloadstate:downloaded:none`)

    const downloadingStr = (downloading)
      ? localize(`downloadstate:downloading:count`,{ smart_count: downloading })
      : localize(`downloadstate:downloading:idle`)

    return (
      <View style={styles.header}>
        <View style={styles.container}>
          <View>
            <Text style={theme.SmallHeading}>{downloadedStr}</Text>
            <Text style={theme.MetaDetail}>{downloadingStr}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.current}>{formatFileSize(used)}</Text>
            <Text style={styles.total}>{availableSpace}</Text>
          </View>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  container: {
    // borderTopColor: colors.SecondaryBackground,
    // borderTopWidth: 1,
    borderBottomColor: colors.SecondaryBackground,
    borderBottomWidth: 1,
    flexDirection: `row`,
    justifyContent: `space-between`,
    alignItems: `center`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  info: {
    
  },
  current: {
    ...theme.SmallHeading,
    textAlign: `right`,
  },
  total:{
    ...theme.MetaDetail,
    textAlign: `right`,
  }
})
