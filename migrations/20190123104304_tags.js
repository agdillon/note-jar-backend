exports.up = (knex, Promise) => {
  return knex.schema.createTable('tags', table => {
    table.increments()
    table.string('tag_name').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('tags')
};
