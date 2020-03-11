var room = 1 // Initialize the client in the first room
fetch()
setInterval(fetch, 2000) // Schedule the refresh

// BIND EVENTS

// Sending a message with the 'Enter' key
$('#content').on('keydown', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault()
		send()
	}
})

// Sending a message with the Send button
$('#send').on('click', (e) => send())

// Clicking on the room name changes the messages
$('.room').on('click', (e) => {
		room = e.target.dataset.id
		$('.room-selected').text(e.target.textContent)
		$('.title span').text(e.target.textContent)
		fetch()
})


// FUNCTIONS

// Sending a message
function send() {
	const content = $('#content').val().trim()
	if (content !== '') {
		$.post({
			url: '/api/send',
			data: { content: content, room: room },
			success: data => {
				if (data) {
					fetch()
					$('#content').val('')
				}
			}
		})
	}
}

// Retrieving the last 10 messages of the current room
function fetch() {
	$.post({
		url: '/api/fetch',
		data: { room: room },
		success: ({ messages, online }) => {
			$('#messages').text('')
			messages.forEach(x => {
				$('#messages').prepend(buildMessage(x.name, x.timestamp, x.content))
			})
			$('#online').text('')
			if (online.length > 1) {
				$('#online').text(online.map(x => x.name).join(', ') + ' are online')
			} else {
				$('#online').text(online[0].name + ' is online')
			}
			
		}
	})
}

// Returning the <div> containing a message
function buildMessage(author, date, content) {
	return `<div class="message"><p class="meta">${author} <span>${relativeDate(date)}</span></p><p class="content">${content}</p></div>`
}

function relativeDate(timestamp) {
	let delta = Math.round((new Date() - new Date(timestamp)) / 1000) // difference in seconds

	if (delta < 60) {
		return delta + ((delta > 1) ? ' seconds ago' : ' second ago')
	} else if (delta < 3600) {
		delta = Math.floor(delta / 60)
		return delta + ((delta > 1) ? ' minutes ago' : ' minute ago')
	} else if (delta < 86400) {
		delta = Math.floor(delta / 3600)
		return delta + ((delta > 1) ? ' hours ago' : ' hour ago')
	} else {
		delta = Math.floor(delta / 86400)
		return delta + ((delta > 1) ? ' days ago' : ' day ago' )
	}
}