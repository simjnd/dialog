const pgp = require('pg-promise')()

const db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'dialog',
	username: 'simon',
	password: 'sql'
})

module.exports = db