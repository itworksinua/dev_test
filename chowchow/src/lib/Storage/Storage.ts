import AsyncStorage from '@react-native-community/async-storage'
import { isEmpty, find, remove, findIndex, merge } from 'lodash'

class Storage<T> {

  public key = `BaseStorage-Objects` // this needs to be overwritten when extending

  public objects: any[] = []

  private hydratePromise: Promise<any> | null = null

  public constructor(key: string) {

    if (typeof key !== `string`) throw Error(`must provide a key`)

    this.key = key
    this.hydrate()

  }

  public async list(): Promise<T[]> {
    await this.hydrate()

    return this.objects
  }

  public async find(id: any): Promise<T> {
    await this.hydrate()
    return find(this.objects, { id })
  }

  public async remove(id: any): Promise<void> {
    await this.hydrate()
    remove(this.objects, { id })
  }

  public async save(object: any, id?: any): Promise<void> {
    await this.hydrate()
    const index = findIndex(this.objects, { id: id || object[`id`] })

    index < 0 ?
      this.objects.push(object) :
      this.objects[index] = object

    await this.persist()
  }

  public async update(data: Partial<T>, id?: any): Promise<T|null> {
    await this.hydrate()
    const index = findIndex(this.objects, { id: id || data[`id`] })
    const record = this.objects[index]

    if (!record) return

    const res = merge(record, data)

    await this.save(res)

    return record
  }

  public async persist(): Promise<void> {
    await AsyncStorage.setItem(this.key, JSON.stringify(this.objects))
  }

  public async clear(): Promise<void> {
    this.objects = []
    return this.persist()
  }

  protected async hydrate(): Promise<void> {
    if (this.hydratePromise) return this.hydratePromise

    return this.hydratePromise = AsyncStorage.getItem(this.key).then((value) => {
      if (isEmpty(value)) return
      return this.objects = JSON.parse(value || `[]`)
    })
  }

  // This had to go because when the class was minified it caused issues

  // protected get key(): string {
  //   return `${this[`constructor`][`name`]}-objects`
  // }

}

export default Storage
