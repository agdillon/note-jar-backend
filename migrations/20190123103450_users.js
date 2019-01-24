exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('email').notNullable()
    table.string('hashed_password').notNullable()
    table.string('code').notNullable()
    table.string('phone')
    table.string('daily_method')
    table.integer('daily_time')
    table.timestamps(true, true)

    table.unique('email')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('users')
};
