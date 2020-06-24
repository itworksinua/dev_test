import * as React from "react"
import { localize } from "../../locale"
import EmptyList from "../../components/EmptyList"

const RecommendationsEmpty = () => {

  return (
    <EmptyList 
      title={localize(`recommendations:empty:title`)}
      subtitle={localize(`recommendations:empty:subtitle`)}
    />
  )
}

export default RecommendationsEmpty
