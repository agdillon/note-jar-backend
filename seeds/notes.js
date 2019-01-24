exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(() => {
      // Inserts seed entries
      return knex('notes').insert([
        {id: 1, user_id: 1, content: 'Pet a cat', type: 'text'},
        {id: 2, user_id: 1, content: 'Every artist was first an amateur. - Emerson', type: 'text'},
        {id: 3, user_id: 1, author: 'J', content: 'You are amazing', type: 'text'},
        {id: 4, user_id: 1, author: 'Dad', content: 'Love you', type: 'text'},
        {id: 5, user_id: 2, author: 'Craig', content: 'Easy day, piece of cake, something', type: 'text'},
        {id: 6, user_id: 2, content: 'It is better to be hated for what you are than to be loved for what you are not. - Andre Gide, Autumn Leaves', type: 'text'},
        {id: 7, user_id: 2, content: `I'm grateful to wake up every day in such a beautiful place`, type: 'text'},
        {id: 8, user_id: 2, content: 'If I had a Delorean, I would probably only drive it from time to time.', type: 'text'}
      ])
        .then(() => {
          // Moves id column (PK) auto-incrementer to correct value after inserts
          return knex.raw("SELECT setval('notes_id_seq', (SELECT MAX(id) FROM notes))")
        })
    })
}
