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

    // cookie
    // let sessionId = request.cookies.sessionId

    // if (!sessionId) {
    //   sessionId = randomUUID()

    //   reply.cookie('sessionId', sessionId, {
    //     path: '/',
    //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    //   })
    // }

    // console.log(name, email)

    // insert
    await knex('users').insert({
      user_id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })
}
