exports.up = (knex, Promise) => {
  return knex.schema.createTable('note_tags', table => {
    table.increments()
    table.integer('note_id').notNullable()
    table.integer('tag_id')
    table.timestamps(true, true)

    table.foreign('note_id').references('id').inTable('notes').onDelete('CASCADE')
    table.foreign('tag_id').references('id').inTable('tags')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('note_tags')
};
