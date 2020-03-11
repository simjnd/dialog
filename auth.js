
const db = require('./database.js')
const bcrypt = require('bcrypt')

const auth = {

	open: ['/login', '/signup', '/api/login', '/api/signup'],

	login: (req, res) => {
		db.oneOrNone('SELECT * FROM participant WHERE email = $1', req.body.email)
		.then(data => {
			if (data.password) {
				bcrypt.compare(req.body.password, data.password, (err, result) => {
				if (result) {
					req.session.user = { id: data.id, name: data.name, email: data.email }
					res.redirect('/')
				} else {
					res.redirect('/login')
					console.log('failed to sign in')
				}
				})
			} else {
				req.error.exist = 'test'
				res.redirect('/login')
			}
			
		})
		.catch(err => {
			console.log(err)
			res.redirect(403, '/login')
		})
	},

	logout: (req, res) => {
		db.none('UPDATE participant SET online = false WHERE id = $1', req.user.id)
		req.session.destroy(err => console.log(err))
		res.redirect('/login')
	},

	authentify: (req, res, next) => {
		if (!auth.open.includes(req.path) && !req.session.user) {
			res.redirect('/login')
		} else {
			req.user = req.session.user
			next()
		}
	},

	signup: async (req, res) => {
		if (req.body.name !== '' && req.body.email !== '' && req.body.password !== '' && req.body.password === req.body.passwordAgain) {
			let hash = await bcrypt.hash(req.body.password, 10)
			await db.none('INSERT INTO participant(name, email, password, online) VALUES($1, $2, $3, FALSE)', [req.body.name,req.body.email, hash])
			db.oneOrNone('SELECT * FROM participant WHERE email = $1', req.body.email)
			.then(data => {
				req.session.user = { id: data.id, name: data.name, email: data.email }
				req.user = req.session.user
				res.redirect('/')
			})
		}
	}

}

module.exports = auth