exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('note_tags').del()
    .then(() => {
      // Inserts seed entries
      return knex('note_tags').insert([
        {id: 1, note_id: 1, tag_id: 4},
        {id: 2, note_id: 2, tag_id: 2},
        {id: 3, note_id: 3, tag_id: 1},
        {id: 4, note_id: 3, tag_id: 2},
        {id: 5, note_id: 4, tag_id: 2},
        {id: 6, note_id: 5, tag_id: 2},
        {id: 7, note_id: 6, tag_id: 2},
        {id: 8, note_id: 7, tag_id: 3},
        {id: 9, note_id: 8, tag_id: 6}
      ])
        .then(() => {
          // Moves id column (PK) auto-incrementer to correct value after inserts
          return knex.raw("SELECT setval('note_tags_id_seq', (SELECT MAX(id) FROM note_tags))")
        })
    })
}
