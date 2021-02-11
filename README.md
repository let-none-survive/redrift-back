### Installation

[Node.js](https://nodejs.org/) v10+ recommended to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd redrift-back
$ cp .env.sample .env
$ yarn install
```

### PostgreSQL
Create database in psql. Set name of db in .env file

`DATABASE_URL=postgresql://localhost:5432/<DATABASE>`

After that run migrations.

```sh
$ knex migrate:latest
```

Run server after migrations

```sh
$ yarn dev
```

### Todos

 - Make better data validation
 - Configure error handling

