import {observable, set, computed, action, runInAction, IObservableArray} from 'mobx'
import {find, get} from 'lodash'
import chipmunk, {tuco} from 'chowchow/src/manager/chipmunk'

export default class BasicsStore {
  @observable public categories = [] as IObservableArray
  @observable public categoryAggregations = [] as IObservableArray
  @observable public languages = [] as IObservableArray

  private promise

  @action.bound
  public async loadBasics() {
    if (this.promise) return this.promise

    return this.promise = chipmunk.run(async () => {
      const result = await tuco('gcuiBasics')
      const { categories, languages } = result.object

      this.categories = categories
      this.languages = languages
    })
  }

  protected observables(): any[] {
    return get(this, '$mobx.values') || []
  }

  protected isArrayObservable(name): boolean {
    const observable = find(this.observables(), (_v, key) => key === name)
    return (get(observable, 'value.constructor.name') === 'ObservableArray') ? true : false
  }
}
