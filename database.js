const pgp = require('pg-promise')()

const db = pgp({
	host: 'localhost',
	port: 33333,
	database: 'simjnd',
	username: 'simjnd',
	password: ''
})

module.exports = db