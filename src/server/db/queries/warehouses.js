const knex = require('../connection')

const firstRow = rows => rows[0] || null

const table_name = 'warehouses'

exports.createWarehouse = data => knex(table_name).insert(data).returning('*').then(firstRow)
exports.removeWarehouse = id => knex(table_name).del().where({id})
exports.updateWarehouse = (id, data) => knex(table_name).update(data).where({id}).returning('*').then(firstRow)
