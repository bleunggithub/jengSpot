exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          username: 'Betty Bee',
          fbId: '10158412922632928',
          userPhoto: '../assets/png/049-worldwide.png',
          points_received: 10,
          points_redeemed: 0,
          admin: false
        },
        {
          id: 2,
          username: 'B L',
          googleId: '100714625662722377353',
          userPhoto: 'https://lh6.googleusercontent.com/-B6YTv7vT8XQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnPXc3ogaMjnsN0U6soau9Zf6X-Sg/s96-c/photo.jpg',
          points_received: 10,
          points_redeemed: 0,
          admin: false
        },
        {
          id: 3,
          username: 'test user',
          password: '$2b$10$sIcFMpUpkOBi72Uwhb1P6eY2jWQrP.pM/F/.IzNsfujzEXFBmDhf2',
          email: 'test@test.com',
          userPhoto: '../assets/png/049-worldwide.png',
          points_received: 0,
          points_redeemed: 0,
          admin: true
        }
      ]);
    });
};
