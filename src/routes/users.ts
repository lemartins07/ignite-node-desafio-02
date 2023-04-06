import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const usersResult = await knex('users').select()

    return { usersResult }
  })

  app.post('/', async (request, reply) => {
    // body schema
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    // insert
    await knex('users').insert({
      user_id: randomUUID(),
      name,
      email,
    })

    // cookie
    reply.clearCookie('userId', { path: '/' })

    const result = await knex('users').select('user_id').first()
    const userId = result.user_id

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })

  app.delete('/all', async (request, reply) => {
    await knex('users').delete()

    reply.status(204).send()
  })
}
