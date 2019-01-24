exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('tags').del()
    .then(() => {
      // Inserts seed entries
      return knex('tags').insert([
        {id: 1, tag_name: 'compliment'},
        {id: 2, tag_name: 'encouragement'},
        {id: 3, tag_name: 'gratitude'},
        {id: 4, tag_name: 'action'},
        {id: 5, tag_name: 'memory'},
        {id: 6, tag_name: 'humor'}
      ])
        .then(() => {
          // Moves id column (PK) auto-incrementer to correct value after inserts
          return knex.raw("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))")
        })
    })
}
