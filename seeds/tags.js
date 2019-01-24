exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('tags').del()
    .then(() => {
      // Inserts seed entries
      return knex('tags').insert([
        {id: 1, name: 'compliment'},
        {id: 2, name: 'encouragement'},
        {id: 3, name: 'gratitude'},
        {id: 4, name: 'action'},
        {id: 5, name: 'memory'},
        {id: 6, name: 'humor'}
      ])
        .then(() => {
          // Moves id column (PK) auto-incrementer to correct value after inserts
          return knex.raw("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))")
        })
    })
}
