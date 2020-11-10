
exports.up = function(knex) {
    return knex.schema
    .createTable('posts', function(table) {     
      table.increments('id').primary();
      table.string('postTitle');
      table.string('postContent',500);
      table.string('postAddress');
      table.string('postDo');
      table.string('postGo');      
      table.string('postLat');
      table.string('postLng');
      table.string('postPhoto');
      table.integer('received_fav');
      table.integer('received_comments');
      table.integer('users_id');
      table.string('users_username');
      table.string('users_userPhoto');
      table.string('postDate')
    }); 
};

exports.down = function(knex) {
    return knex.schema.dropTable('posts');
};
