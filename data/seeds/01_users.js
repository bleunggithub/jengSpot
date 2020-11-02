exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {id: 1, username: 'bleung', name: 'Betty', email: 'BettyatJengspot@test.com', number_of_posts: '1'},
        {id: 2, username: 'bibek', name: 'Bibek', email: 'BibekatJengspot@test.com', number_of_posts: '1'},
        {id: 3, username: 'clee', name: 'Curtis', email: 'CurtisatJengspot@test.com', number_of_posts: '1'}
      ]);
    });
};
