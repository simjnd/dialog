
const { app, auth, html } = require('./setup')
const db = require('./database')

app
.get('/', async (req, res) => {
	let rooms = await db.query('SELECT * FROM room ORDER BY id')
	res.render('home', { name: req.user.name, rooms: rooms })
})

.get('/login', (req, res) => {
	console.log(req.errors)
	if (req.user) {
		res.redirect('/')
	} else {
		res.render('login')
	}
})

.get('/logout', auth.logout)

.get('/signup', (req, res) => {
	if (req.user) {
		res.redirect('/')
	} else {
		res.render('signup')
	}
})

.post('/api/signup', auth.signup)

.post('/api/login', auth.login)

.post('/api/send', (req, res) => {
	if (req.user) {
		if (req.body.content.trim() !== '') {
			db.none('INSERT INTO message(author, content, room, timestamp) VALUES($1, $2, $3, $4)', [
				req.user.id,
				req.body.content.trim(),
				req.body.room,
				Date.now()
			])
			.then(data => res.json(1))
			.catch(err => res.json(null))
		}
	}
})

.post('/api/fetch', async (req, res) => {
	if (req.user) {
		await db.query('UPDATE participant SET online = TRUE WHERE id = $1', req.user.id)
		let messages = await db.query('SELECT name, content, timestamp, room FROM message, participant WHERE room = $1 AND participant.id = author ORDER BY timestamp DESC LIMIT 10', req.body.room)
		messages.forEach(x => {
			x.content = html(x.content)
			x.timestamp = parseInt(x.timestamp)
		})
		let online = await db.query('SELECT name FROM participant WHERE online <> FALSE ORDER BY name')
		res.json({
			messages: messages,
			online: online
		})
	}
})

.listen(22222)