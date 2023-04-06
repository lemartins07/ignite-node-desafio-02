import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('meal_id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('in_diet').notNullable()
    table.uuid('user_id').notNullable()
    table.foreign('user_id').references('user_id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
