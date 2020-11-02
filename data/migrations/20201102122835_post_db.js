
exports.up = function(knex) {
    return knex.schema
    .createTable('post', function(table) {     
      table.increments('id');
      table.string('title');
      table.string('content');
      table.integer('received_like');
      table.integer('received_comments');
      table.timestamps(true, true);
      table.integer('user_id');
      table.foreign('user_id').references('user.id');                    
    }); 
};

exports.down = function(knex) {
    return knex.scheme.dropTable('post');
};
