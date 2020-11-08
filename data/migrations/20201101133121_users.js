
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
      table.string('email');
      table.string('googleId');
      table.string('fbId');
      table.string('userPhoto');
      table.integer('number_of_posts');
      table.timestamps(true, true);      
    });    
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};

