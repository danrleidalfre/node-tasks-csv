import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { formatCurrentDate } from './utils/format-current-date.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { 
        title,
        description,
      } = req.body

      const user = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: formatCurrentDate(),
        updated_at: null
      }

      database.insert('tasks', user)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { 
        title,
        description
      } = req.body

      const dataUpdate = { 
        title,
        description,
        updated_at: formatCurrentDate()
      }

      if (database.update('tasks', id, dataUpdate)) {
        return res.writeHead(204).end()
      }

      return res.writeHead(404).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.complete('tasks', id)) {
        return res.writeHead(204).end()
      }

      return res.writeHead(404).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.delete('tasks', id)) {
        return res.writeHead(204).end()
      }

      return res.writeHead(404).end()
    },
  },
]
