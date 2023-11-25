import fs from 'node:fs/promises'
import { formatCurrentDate } from './utils/format-current-date.js'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const original = this.#database[table][rowIndex]

      const updateData = {
        id: original.id,
        title: data.title ? data.title : original.title,
        description: data.description ? data.description : original.description,
        completed_at: null,
        created_at: original.created_at,
        updated_at: data.updated_at
      }

      this.#database[table][rowIndex] = { id, ...updateData }
      this.#persist()

      return true
    }

    return false
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const original = this.#database[table][rowIndex]
      const isComplete = original.completed_at !== null

      const updateData = {
        id: original.id,
        title: original.title,
        description: original.description,
        completed_at: isComplete ? null : formatCurrentDate(),
        created_at: original.created_at,
        updated_at: formatCurrentDate()
      }

      this.#database[table][rowIndex] = { id, ...updateData }
      this.#persist()

      return true
    }

    return false
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()

      return true
    }

    return false
  }
}
