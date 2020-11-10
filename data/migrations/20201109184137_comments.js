
exports.up = function(knex) {
  return knex.schema
    .createTable('comments', function(table) {
        table.increments('id').primary();
        table.integer('users_id');
        table.foreign('users_id').references('users.id');
        table.string('commentContent');
        table.integer('posts_id');
        table.foreign('posts_id').references('posts.id');                          
      table.timestamps(true, true);
    });    
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
  
};
