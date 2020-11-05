
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('password').notNullable();
      table.string('email').notNullable();
      table.integer('number_of_posts').notNullable();
      table.timestamps(true, true);      
    });    
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};

