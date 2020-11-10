
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
      table.integer('points_received');
      table.integer('points_redeemed');
      table.timestamps(true, true); 
      table.boolean('admin');
    });    
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};

