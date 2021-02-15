const knex = require('../connection')

const firstRow = rows => rows[0] || null

const table_name = 'warehouse'

exports.addToWarehouse = data =>
  knex(table_name).insert(data).returning('*').then(firstRow)
exports.updateWarehouse = (id, data) =>
  knex(table_name).update(data).where({ id }).returning('*').then(firstRow)
exports.getWarehouse = () => knex(table_name).select('*')
exports.getWhere = where =>
  knex(table_name)
    .select(
      'warehouse.*',
      'warehouses.name as warehouse_name',
      'productions.name as production_name'
    )
    .where(where)
    .leftJoin('warehouses', 'warehouses.id', 'warehouse.warehouse_id')
    .leftJoin('productions', 'productions.id', 'warehouse.production_id')
exports.getDistributedAmount = production_id =>
  knex(table_name)
    .select('*')
    .where({ production_id })
    .then(data => {
      return data.map(i => i.amount).reduce((acc, val) => acc + val, 0)
    })
