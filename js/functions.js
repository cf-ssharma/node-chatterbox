var my;
var websocket = io.connect('//localhost:3000');

window.onload = function(){
	// Welcome message, contains all the online users and actual messages.
	websocket.on('welcome_msg', function(users_list, messages){
		$('#users_online').find('li').remove();
		for(var i in users_list){
			$('#users_online').append('<li id="user_' + users_list[i].id + '">' + users_list[i].nickname + '</li>');
		}

		$('#messages').find('article').remove();
		for(var i in messages){
			$('#messages').append('<article class="' + messages[i].cls + '">' + messages[i].msg + '</article>');
		}
	})

	// On new user connection...
	websocket.on('new_user', function(nickname, id){
		var new_item = $('<li id="user_' + id + '" style="opacity: 0">' + nickname + '</li>');
		new_item.prependTo($('#users_online')).animate({opacity: 1});
	});

	// On new message incoming...
	websocket.on('new_msg', function(msg, cls){
		var new_message = $('<article class="' + cls + '">' + msg + '</article>');
		new_message.prependTo($('#messages'));
	})

	// Login to the chat
	$('#login').on('submit', function(){
		event.preventDefault();

		$('#login').fadeOut('normal', function(){
			$(this).remove();
		});

		$('#messages').animate({height: '284px'}, function(){
			$('#message').fadeIn();			
		});

		websocket.emit('new_user', $('#login_name').val());
		my = $('#login_name').val();
	});

	// Send a new message
	$('#message').on('submit', function(){
		event.preventDefault();
		websocket.emit('new_msg', '<strong>' + my + '</strong>: ' + $('#message_txt').val(), '');
		$('#message_txt').val('');
	})
}