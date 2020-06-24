import * as React from "react"
import {map} from 'lodash'
import { View, Text, StyleSheet, } from "react-native"

import theme from "chowchow/src/theme"
import { localize } from "chowchow/src/locale"

interface EmptyListProps {
  country?: string;
  year?: number;
  crews?: any[];
  casts?: any[];
}

class ShowMetaDetails extends React.Component<EmptyListProps, any> {

  public render() {

    const {
      country,
      year,
      crews,
      casts,

    } = this.props

    const metas = [
      {
        name: localize(`meta:label:country`),
        value: country
      },
      {
        name: localize(`meta:label:creator`),
        value: map(crews, c => c.name).join(`\n`)
      },
      {
        name: localize(`meta:label:cast`),
        value: map(casts, c => c.name).join(`\n`)
      },
      {
        name: localize(`meta:label:year`),
        value: year
      },
    ]

    return map(metas, (meta, i) => buildMetaRow(meta.name, meta.value, i))
  }

}

function buildMetaRow(name,value, key) {
  if (!value) return null

  return (
    <View style={styles.container} key={key}>
      <Text style={theme.MetaHeading}>{name}</Text>
      <Text style={styles.metaDetail}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
  },
  metaDetail: {
    ...theme.Paragraph,
    marginBottom: 10,
  }

})

export default ShowMetaDetails
