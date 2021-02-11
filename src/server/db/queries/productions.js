const knex = require('../connection')

const firstRow = rows => rows[0] || null

const table_name = 'productions'

exports.createProduction = data => knex(table_name).insert(data).returning('*').then(firstRow)
exports.updateProduction = (id, data) => knex(table_name).update(data).where({id}).returning('*').then(firstRow)
exports.getProductions = () => knex(table_name).select('*')
