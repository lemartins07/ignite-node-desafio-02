import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  // READ
  app.get('/', async (request, reply) => {
    const meals = await knex('meals').select()

    return { meals }
  })

  // CREATE
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
      userId: z.string(),
    })

    console.log(request.body)
    const { name, description, inDiet, userId } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      name,
      description,
      in_diet: inDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
