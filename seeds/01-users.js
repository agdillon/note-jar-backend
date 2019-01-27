exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'alice@email.com', hashed_password: 'password', code: 'ABCDEFG', daily_method: 'push'},
        {id: 2, email: 'bob@email.com', hashed_password: 'password', code: 'BCDEFGH'}
      ])
        .then(() => {
          // Moves id column (PK) auto-incrementer to correct value after inserts
          return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
        })
    })
}
