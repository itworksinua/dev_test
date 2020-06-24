import {intersection, isEmpty} from 'lodash'

export const noCommonElements = (a:any[], b: any[]) => {

  return isEmpty(intersection(a, b))
}
