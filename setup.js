
const setup = () => {
	
	const express = require('express')
	const app = express()
	const session = require('express-session')
	const bodyParser = require('body-parser')
	const auth = require('./auth.js')
	const html = require('escape-html')
	
	app
	.set('view engine', 'ejs')
	.use(express.static('static'))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(session({
		secret: 'dialog',
		resave: false,
		saveUninitialized: true
	}))
	.use(auth.authentify)

	return {
		app: app,
		auth: auth,
		html: html
	}

}

module.exports = setup()