import Storage from './Storage'
import { get } from 'lodash'

const SESSION_KEY = 'session'
const DOMAIN_KEY = 'domain'
const STATS_KEY = 'stats'
const TOUCH_ID_KEY = 'touch-id'

class SessionStorage extends Storage<any> {
  public constructor(){
    super(`SessionStorage-Objects`)
  }

  public async getDomain(): Promise<string> {
    return (await this.getValue(DOMAIN_KEY)) || 'https://mpx.mediapeers.us'
  }

  public async saveDomain(domain): Promise<void> {
    return this.saveValue(domain, DOMAIN_KEY)
  }

  public async getSession(): Promise<any> {
    return this.getValue(SESSION_KEY)
  }

  public async saveSession(session): Promise<void> {
    return this.saveValue(session, SESSION_KEY)
  }

  public async getStats(): Promise<any> {
    return this.getValue(STATS_KEY)
  }

  public async saveStats(stats): Promise<void> {
    return this.saveValue(stats, STATS_KEY)
  }

  public async isTouchIdEnabled(): Promise<boolean> {
    return !!(await this.getValue(TOUCH_ID_KEY))
  }

  public async enableTouchId(): Promise<void> {
    return this.saveValue('enabled', TOUCH_ID_KEY)
  }

  private async saveValue(value: any, id: string): Promise<void> {
    return this.save({ value, id })
  }

  private async getValue(id: string): Promise<any> {
    const record = await this.find(id)
    return get(record, 'value')
  }
}

export default SessionStorage
