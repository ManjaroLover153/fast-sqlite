import { FastQL } from './engine.js'

const db = new FastQL('fastql.db')

;(async () => {
  await db.run(`CREATE TABLE users (id INT, name TEXT);`)
  await db.run(`INSERT INTO users VALUES (1, 'Bartek');`)
  const results = await db.run(`SELECT * FROM users WHERE name = 'Bartek';`)
  console.log(results)
})()
