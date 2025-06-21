# Fast-SQLite

> ⚡ A lightweight SQL-like DB engine with custom parser and `.db` storage.

## Install

```bash
npm i fastql
```

# Example

```js
import { FastQL } from 'fastql'

const db = new FastQL('my.db')

await db.run('CREATE TABLE users (id INT, name TEXT);')
await db.run("INSERT INTO users VALUES (1, 'Bartek');")
const results = await db.run("SELECT * FROM users WHERE name = 'Bartek';")
console.log(results)
```