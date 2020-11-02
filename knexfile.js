require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    }, 

    migrations: {
      directory: './data/migrations',
    },

    seeds: { directory: './data/seeds' },
  },

  testing: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './data/migrations',
    },
    seeds: { directory: './data/seeds' },
  },
};