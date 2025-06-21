import { promises as fs } from 'fs'

export class Storage {
  private path: string
  private db: Record<string, any[]> = {}

  constructor(path: string) {
    this.path = path
  }

  async load() {
    try {
      const data = await fs.readFile(this.path, 'utf-8')
      this.db = JSON.parse(data)
    } catch {
      this.db = {}
      await this.save()
    }
  }

  async save() {
    await fs.writeFile(this.path, JSON.stringify(this.db, null, 2))
  }

  getTable(name: string): any[] {
    return this.db[name] || []
  }

  setTable(name: string, rows: any[]) {
    this.db[name] = rows
    return this.save()
  }

  hasTable(name: string): boolean {
    return Object.hasOwn(this.db, name)
  }

  createTable(name: string) {
    if (!this.hasTable(name)) {
      this.db[name] = []
      return this.save()
    }
  }
}
