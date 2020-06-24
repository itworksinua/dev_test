import * as React from "react"
import { localize } from "../../locale"
import EmptyList from "../../components/EmptyList"

const ScreeningsEmpty = () => {
  return (
    <EmptyList
      title={localize(`screenings:empty:title`)}
      subtitle={localize(`screenings:empty:subtitle`)}
    />
  )
}

export default ScreeningsEmpty
