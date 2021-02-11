require('dotenv').config()
const path = require('path')
const BASE_PATH = path.join(__dirname, 'src', 'server', 'db')

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds/mock')
    }
  },
}
