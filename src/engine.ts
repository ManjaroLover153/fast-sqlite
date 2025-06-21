import { Storage } from './storage.js'

export class FastQL {
  private storage: Storage

  constructor(path: string) {
    this.storage = new Storage(path)
    this.init()
  }

  private async init() {
    await this.storage.load()
  }

  async run(query: string): Promise<any> {
    const tokens = query.trim().split(/\s+/)
    const command = tokens[0].toUpperCase()

    if (command === 'CREATE' && tokens[1].toUpperCase() === 'TABLE') {
      const tableName = tokens[2]
      this.storage.createTable(tableName)
      return `Table ${tableName} created`
    }

    if (command === 'INSERT') {
      const tableName = tokens[2]
      const valuesMatch = query.match(/\((.+)\)/)
      if (!valuesMatch) throw new Error('Invalid INSERT syntax')
      const values = valuesMatch[1].split(',').map(v => v.trim().replace(/['"]/g, ''))
      const table = this.storage.getTable(tableName)
      table.push(Object.fromEntries(values.map((v, i) => [`col${i}`, v])))
      await this.storage.setTable(tableName, table)
      return 'Inserted'
    }

    if (command === 'SELECT') {
      const tableName = tokens[3]
      const table = this.storage.getTable(tableName)
      return table
    }

    throw new Error('Unsupported query')
  }
}
