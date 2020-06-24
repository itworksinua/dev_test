import { observable, action, } from 'mobx'
import { AppState } from 'react-native'
import { reAuthenticate } from '../navigation'

const LOCK_TIMER = 60 * 1000 // 60 seconds

export default class AppStateStore {

  @observable public isActive: boolean = determineIsActive(AppState.currentState)
  @observable public lastActive: number = (new Date()).getTime()

  public constructor() {
    this.listen()
  }

  @action.bound
  public listen(): void {
    AppState.addEventListener(`change`, state => {
      
      console.log(state, this.isActive)

      // Are we active
      const nextIsActive: boolean = determineIsActive(state)

      // No state change
      if (this.isActive && nextIsActive) return

      // Update state
      this.isActive = nextIsActive

      const now = (new Date()).getTime()

      // going inactive
      if(!this.isActive) {
        this.lastActive = now
        return
      }

      const lapsed = now - this.lastActive

      const isLapsed = lapsed > LOCK_TIMER

      // should we force authentication
      if (isLapsed) reAuthenticate()
    })
  }

}

function determineIsActive(state): boolean {
  return !state.match(/background/)
}
