
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('post').del()
    .then(function () {
      // Inserts seed entries
      return knex('post').insert([
        { id: 1,
          title: 'Mong Kong GEM',
          content: 'testing content 12345',
          user_id: 2
        },
        { id: 2,
          title: 'Sai Kung Hidden GEM',
          content: 'testing content 12345',
          user_id: 2
        },
        { id: 3,
          title: 'Sheung Wan Dried Goods GEM',
          content: 'testing content 12345',
          user_id: 2
        }
      ]);
    });
};
