import { describe, it, expect } from 'vitest'
import { FastQL } from '../src/engine.js'

describe('FastQL', () => {
  it('creates, inserts, selects', async () => {
    const db = new FastQL('test.db')
    await db.run('CREATE TABLE users (id INT, name TEXT);')
    await db.run("INSERT INTO users VALUES (1, 'Test');")
    const result = await db.run('SELECT * FROM users')
    expect(result.length).toBe(1)
    expect(result[0].col1).toBe('Test')
  })
})
