
exports.up = function(knex) {
  return knex.schema
    .createTable('comments', function(table) {
        table.increments('id').primary();
        table.integer('users_id');
      table.foreign('users_id').references('users.id');
      table.string('users_userPhoto');
      table.string('users_username')
        table.string('commentContent');
        table.integer('posts_id');
        table.foreign('posts_id').references('posts.id');                          
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
  
};
