import {observable, action} from 'mobx'
import {get, merge} from 'lodash'
import * as Keychain from 'react-native-keychain'
import TouchID from 'react-native-touch-id'

import {login, logout} from 'chowchow/src/lib/sessionApi'
//import {setUserId} from 'chowchow/src/manager/firebase'
import {SessionStorage} from 'chowchow/src/lib/Storage'
import {confirmTouchId} from 'chowchow/src/manager/alert'
import {showSpinner, hideSpinner} from "chowchow/src/navigation"

import store from 'chowchow/src/store'
import chipmunk, {tuco} from 'chowchow/src/manager/chipmunk'

export default class SessionStore {
  @observable public session: any
  @observable public stats = {
    downloads: 0,
    favorites: 0,
    recommendations: 0,
    screenings: 0,
    subscriptions: 0,
    recentlyViewed: 0,
  }

  @action.bound
  public async reauthenticate(): Promise<boolean> {
    const session = await SessionStorage.getSession()
    const touchIdEnabled = await SessionStorage.isTouchIdEnabled()
    const touchIdSupported = await !!TouchID.isSupported()

    if (!session || !touchIdEnabled || !touchIdSupported) return false

    const passed = await TouchID.authenticate(`Authenticate with fingerprint`)
    if (!passed) return false

    if (store.network.connected) {
      try {
        const credentials = await Keychain.getGenericPassword()
        if (!credentials) return false

        const domain = await SessionStorage.getDomain()

        return this.authenticate(
          credentials.username,
          credentials.password,
          domain
        )
      }
      catch {
        return false
      }
    }

    this.session = session
    return true
  }

  @action.bound
  public async authenticate(email, password, domain): Promise<boolean> {
    await SessionStorage.saveDomain(domain)

    if (!domain.match(/^https:\/\//)) {
      domain = `https://${domain}`
    }

    try {
      await showSpinner()
      this.session = await login(email, password, domain)
    }
    finally {
      await hideSpinner()
    }

    SessionStorage.saveSession(this.session)
    //setUserId(this.session.user.id)

    console.log('ha')
    const touchIdEnabled = await SessionStorage.isTouchIdEnabled()
    const touchIdSupported = await !!TouchID.isSupported()

    if (touchIdSupported && !touchIdEnabled) {
      await new Promise((resolve) => {
        confirmTouchId(() => {
          SessionStorage.enableTouchId()
          Keychain.setGenericPassword(email, password)
          resolve()
        }, () => {
          Keychain.resetGenericPassword()
          resolve()
        })
      })
    }

    return true
  }

  @action.bound
  public async logout(): Promise<void> {
    await Keychain.resetGenericPassword()
    await SessionStorage.clear()
    await store.download.removeAll()
    logout()

    this.session = null
    this.stats = {
      downloads: 0,
      favorites: 0,
      recommendations: 0,
      screenings: 0,
      subscriptions: 0,
      recentlyViewed: 0,
    }
  }

  @action.bound
  public modifyStats(name, value: number) {
    this.stats[name] += value
  }

  @action.bound
  public setStats(name, value: number) {
    this.stats[name] = value
  }

  @action.bound
  public async loadStats() {
    let stats

    if (store.network.connected) {
      const userId = get(this, `session.user.id`)
      stats = (await tuco('gcuiCounts', {userId})).object
      SessionStorage.saveStats(stats)
    }
    else {
      stats = await SessionStorage.getStats()
    }

    if (stats) this.stats = stats
  }
}
