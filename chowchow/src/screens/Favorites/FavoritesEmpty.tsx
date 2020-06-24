import * as React from "react"
import { localize } from "../../locale"
import EmptyList from "../../components/EmptyList"

const FavoritesEmpty = () => {

  return (
    <EmptyList 
      title={localize(`favorites:empty:title`)}
      subtitle={localize(`favorites:empty:subtitle`)}
    />
  )
}

export default FavoritesEmpty

