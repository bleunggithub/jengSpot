
exports.up = function(knex) {
    return knex.schema
    .createTable('posts', function(table) {     
      table.increments('id');
      table.string('postTitle');
      table.string('postContent');
      table.string('postAddress');
      table.string('postDo');
      table.string('postGo');      
      table.string('postLat');
      table.string('postLng');
      table.string('postPhoto');
      table.integer('received_fav');
      table.integer('received_comments');
      table.integer('user_id');
      table.foreign('user_id').references('users.id');                    
      table.timestamps(true, true);
    }); 
};

exports.down = function(knex) {
    return knex.schema.dropTable('posts');
};
