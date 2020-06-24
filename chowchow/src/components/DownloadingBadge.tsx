import * as React from "react"
import { View, Dimensions } from "react-native"
import colors from "../theme/colors"

const DownloadingBadge = (props: any) => {
  return (
    <View style={style}></View>
  )
}

export default DownloadingBadge

const size = 20

const style = {
  width: size,
  height: size,
  backgroundColor: colors.Primary,
  borderRadius: size/2,
  top: Dimensions.get(`window`).height - size - 30,
  left: (Dimensions.get(`window`).width / 2) + 55
}
