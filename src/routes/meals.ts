import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-session-exists'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  // READ
  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId
    const meals = await knex('meals').select().where('user_id', userId)

    return { meals }
  })

  // READ ALL
  app.get('/all', async (request, reply) => {
    const meals = await knex('meals').select()

    return { meals }
  })

  // CREATE
  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
    })

    const userId = request.cookies.userId

    const { name, description, inDiet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      meal_id: randomUUID(),
      name,
      description,
      in_diet: inDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  // DELETE ALL
  app.delete('/all', async (request, reply) => {
    await knex('meals').delete()

    reply.status(204).send()
  })
}
