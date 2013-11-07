var server = require('socket.io').listen(3000);

var online_users = [];
var last_id = 0;

var messages = [];


server.sockets.on('connection', function(socket){
	// On new connection, we send a welcome message containing online users and current messages.
	server.sockets.emit('welcome_msg', online_users, messages);

	// When a new user became online...
	socket.on('new_user', function(nick){
		var exists = false;

		online_users.filter(function(user){
			if(user.nickname == nick)
				exists = true;
		});


		// If is a new user, we add him to main array and emit a message with the new user (for the online
		// users sidebar), and add a new message showing her action.
		if(!exists){
			online_users.unshift({id: ++last_id, nickname: nick});
			server.sockets.emit('new_user', nick, last_id);
			add_msg(nick + ' just joined to the chat.', 'login');
		}
	});

	// New message incoming...
	socket.on('new_msg', function(msg, cls){
		add_msg(msg, cls);
	});
});

// Send a new message
function add_msg(msg, cls){
	messages.unshift({cls: cls, msg: msg});
	server.sockets.emit('new_msg', msg, cls);
}