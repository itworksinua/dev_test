import * as React from "react"
import { localize } from "../locale"
import EmptyList from "./EmptyList"

const OfflineMode = () => {
  return (
    <EmptyList
      title={``}
      subtitle={localize(`offiline:mode:subtitle`)}
    />
  )
}

export default OfflineMode
