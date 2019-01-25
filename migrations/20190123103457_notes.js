exports.up = (knex, Promise) => {
  return knex.schema.createTable('notes', table => {
    table.increments()
    table.integer('user_id').notNullable()
    table.string('author')
    table.text('content').notNullable()
    table.string('type').notNullable().defaultTo('text')
    table.timestamps(true, true)

    table.foreign('user_id').references('id').inTable('users')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('notes')
}
