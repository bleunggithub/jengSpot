
exports.up = function(knex) {
  return knex.schema
    .createTable('favposts', function(table) {
      table.integer('users_id');
      table.foreign('users_id'); 
      table.integer('posts_id');
      table.foreign('posts_id');     
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('favposts');
};
