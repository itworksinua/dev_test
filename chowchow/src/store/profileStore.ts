import { map, get, find } from 'lodash'
import chipmunk from 'chowchow/src/manager/chipmunk'
import { observable, computed, action, runInAction, IObservableArray } from 'mobx'

// TODO: the nested schema does not work here
const SCHEMA = `
 id, name, legal_entity,
 addresses {
   street, city, state, zip_code,
   country { id, name }
 },
 phones { number }`

export default class ProfileStore {
  @observable public company

  @action.bound
  public async getCompany(id) {
    this.company = (await chipmunk.action('um.organization', 'get', {
      params: { organization_id: id },
      schema: SCHEMA,
    })).object
  }
}
