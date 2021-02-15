exports.up = function (knex) {
  return knex.schema.createTable('productions', table => {
    table.increments()
    table.string('name')
    table.integer('amount')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('productions')
}
