exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          username: 'test user',
          password: '$2b$10$jiYJ9x.JPzuwj4YE7T47H.Ys/mcqxiuSbSho2lXzi41c3smak0jgO',
          email: 'test@test.com',
          userPhoto: '../assets/png/049-worldwide.png',
          points_received: 0,
          points_redeemed: 0,
          admin: true
        }
      ]);
    });
};
