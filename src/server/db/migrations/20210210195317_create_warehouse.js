
exports.up = function(knex) {
  return knex.schema.createTable('warehouse', table => {
    table.increments()
    table.integer('production_id').notNullable()
    table.foreign("production_id").references("id").inTable("productions").onDelete('CASCADE')
    table.integer('warehouse_id').notNullable()
    table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete('CASCADE')
    table.integer('amount')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('warehouse')
};
