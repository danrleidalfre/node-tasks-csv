import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

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
        completed_at,
        created_at,
        updated_at
      } = req.body

      const user = {
        id: randomUUID(),
        title,
        description,
        completed_at,
        created_at,
        updated_at
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
        description,
        completed_at,
        created_at,
        updated_at
      } = req.body

      database.update('tasks', id, { 
        title,
        description,
        completed_at,
        created_at,
        updated_at
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    },
  },
]
