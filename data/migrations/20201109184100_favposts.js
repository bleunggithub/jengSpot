
exports.up = function(knex) {
  return knex.schema
    .createTable('favposts', function(table) {
      table.integer('users_id').primary();
      table.foreign('users_id').references('users.id');    
      table.integer('posts_id');
      table.foreign('posts_id').references('posts.id');       
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('favposts');
};
