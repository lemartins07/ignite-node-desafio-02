import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-session-exists'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
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

  // UPDATE
  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const userId = request.cookies.userId

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inDiet: z.boolean(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)
      const { name, description, inDiet } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals')
        .update({
          name,
          description,
          in_diet: inDiet,
        })
        .where({ meal_id: id, user_id: userId })

      reply.status(204).send()
    },
  )

  // DELETE
  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const userId = request.cookies.userId

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals').where({ meal_id: id, user_id: userId }).delete()

      reply.status(204).send()
    },
  )

  // DELETE ALL
  app.delete('/all', async (request, reply) => {
    await knex('meals').delete()

    reply.status(204).send()
  })
}
