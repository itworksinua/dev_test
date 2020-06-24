import {get} from 'lodash'

export const hasPropChanged = (prevProps, nextProps, propPath): boolean => {
  const prevValue = get(prevProps, propPath)
  const nextValue = get(nextProps, propPath)
  return (
    (prevValue && !nextValue) ||
    (!prevValue && nextValue) ||
    (prevValue !== nextValue)
  )
}
