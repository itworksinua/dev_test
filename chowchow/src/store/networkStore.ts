import { observable, action, } from 'mobx'
import NetInfo, { ConnectionInfo } from '@react-native-community/netinfo'
import {  get } from 'lodash'

export default class NetworkStore {

  @observable public lastInfo: any
  @observable public connected: boolean = false
  @observable public onWifi: boolean = false
  @observable public intentionallyTurnedOff: boolean = false

  public constructor() {
    this.indentifyStatus = this.indentifyStatus.bind(this)

    // NetInfo.getConnectionInfo().then(this.indentifyStatus)

    NetInfo.addEventListener(`connectionChange`, this.indentifyStatus)

  }

  @action.bound
  public toggleConnectivity(): void {
    this.intentionallyTurnedOff = !this.intentionallyTurnedOff
    this.indentifyStatus()
  }

  public setConnectivity(newValue: boolean): void {
    this.intentionallyTurnedOff = newValue
    this.indentifyStatus()
  }

  private indentifyStatus(change?: ConnectionInfo | any): void {
    console.log(`connectivity change`, change)

    if (change) this.lastInfo = change
    const type = get(this.lastInfo, `type`)

    if (this.intentionallyTurnedOff) {
      this.connected = false
      this.onWifi    = false
    }
    else {
      this.connected = !!type.match(/wifi|cellular/)
      this.onWifi    = !!type.match(/wifi/)
    }

    console.log(`this.connected`, this.connected)
    console.log(`this.onWifi`, this.onWifi)
  }

}
