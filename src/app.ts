import fastify from 'fastify'
import cookies from '@fastify/cookie'
import { userRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookies)

app.register(userRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
