import * as React from "react"
import { localize } from "../../locale"
import EmptyList from "../../components/EmptyList"

const SubscriptionsEmpty = () => {

  return (
    <EmptyList
      title={localize(`subscriptions:empty:title`)}
      subtitle={localize(`subscriptions:empty:subtitle`)}
    />
  )
}

export default SubscriptionsEmpty

