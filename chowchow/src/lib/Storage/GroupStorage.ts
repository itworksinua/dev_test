import Storage from './Storage'

class GroupStorage extends Storage<{}> {
  public constructor(){
    super(`GroupStorage-Objects`)
  }

  public async getAll(): Promise<{}[]> {
    const list = await this.list()

    return list
  }
}

export default GroupStorage
