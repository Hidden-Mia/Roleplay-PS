'use strict';

exports.commands = {
	
	    fj: 'forcejoin',
    forcejoin: function(target, room, user) {
        if (!user.can('mute')) return false;
        if (!target) return this.sendReply('/forcejoin [target], [room] - Forces a user to join a room');
        let parts = target.split(',');
        if (!parts[0] || !parts[1]) return this.sendReply('/forcejoin [target], [room] - Forces a user to join a room');
        let userid = toId(parts[0]);
        let roomid = toId(parts[1]);
        if (!Users.get(userid)) return this.sendReply ('User not found.');
        if (!Rooms.get(roomid)) return this.sendReply ('Room not found.');
        Users.get(userid).joinRoom(roomid);
    },
    	roomlist: function (target, room, user) {
        if(!this.can('pban')) return;
        var totalUsers = 0;
		for (var u of Users.users) {
			u = u[1];
			if (Users(u).connected) {
				totalUsers++;
			}
 
	}
		var rooms = Object.keys(Rooms.rooms),
		len = rooms.length,
		header = ['<b><font color="#DA9D01" size="2">Total users connected: ' + totalUsers + '</font></b><br />'],
		official = ['<b><font color="#1a5e00" size="2">Official chat rooms:</font></b><br />'],
		nonOfficial = ['<hr><b><font color="#000b5e" size="2">Public chat rooms:</font></b><br />'],
		privateRoom = ['<hr><b><font color="#ff5cb6" size="2">Private chat rooms:</font></b><br />'],
		groupChats = ['<hr><b><font color="#740B53" size="2">Group Chats:</font></b><br />'],
		battleRooms = ['<hr><b><font color="#0191C6" size="2">Battle Rooms:</font></b><br />'];
 	while (len--) {
			var _room = Rooms.rooms[rooms[(rooms.length - len) - 1]];
			if (_room.type === 'battle') {
				battleRooms.push('<a href="/' + _room.id + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
			}
			if (_room.type === 'chat') {
					if (_room.isPersonal) {
						groupChats.push('<a href="/' + _room.id + '" class="ilink">' + _room.id + '</a> (' + _room.userCount + ')');
						continue;
					}
					if (_room.isOfficial) {
						official.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
						continue;
					}
					if (_room.isPrivate) {
						privateRoom.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
						continue;
					}
			}
			if (_room.type !== 'battle' && _room.id !== 'global') nonOfficial.push('<a href="/' + toId(_room.title) + '" class="ilink">' + _room.title + '</a> (' + _room.userCount + ')');
		}
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
    },
    cgdeclare: 'customgdeclare',
	customgdeclare: function (target, room, user) {
		let parts = target.split(',');
		if (!target) return this.parse('/help customgdeclare');
		if (!parts[4]) return this.parse('/help customgdeclare');
		if (!this.can('gdeclare')) return false;

		for (let id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue" style="border-radius: 5px;"><b>We are hosting a <font color="#57194A"><b>' + parts[0] + '</b></font> in <button name="send" value="/join ' + parts[1] + '" style="border-radius: 3px; margin: 3px; padding: 2px 5px; font-weight: bold; font-style: italic; box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.35); color: #57194A; text-shadow: none;">' + parts[1] + '</button> !<br />The tier is <font style="color: #57194A; font-weight: bold;"><b>' + parts[2] + '</b></font>! Join up and have fun!<br /><br />The prize for the winner is <font style="color: #57194A; font-weight: bold;"><b>' + parts[3] + '</b></font> bucks, while the runner-up will get <font style="color: #57194A; font-weight: bold;"><b>' + parts[4] + '</b></font> bucks!<br /><small><i>~' + user.name + '</i></small></b></div>');
		}
		this.logModCommand(user.name + " globally custom declared " + target);
	},
	customgdeclarehelp: ["/customgdeclare [event name], [room], [tier], [buck reward], [runner-up buck reward] - Preset gdeclare which anonymously announces a message to every room on the server. Requires: &, ~"],

mt: 'mktour',
	mktour: function(target, room, user) {
		if (!target) return this.errorReply("Usage: /mktour [tier] - creates a tournament in single elimination.");
		target = toId(target);
		let t = target;
		if (t === 'rb') t = 'randombattle';
		if (t === 'cc1v1' || t === 'cc1vs1') t = 'challengecup1v1';
		if (t === 'randmono' || t === 'randommonotype') t = 'monotyperandombattle';
		if (t === 'mono') t === 'monotype';
		if (t === 'ag') t === 'anythinggoes';
		if (t === 'ts') t === 'tiershift';
		this.parse('/tour create ' + t + ', elimination');
	},
	rb: 'redbattle',
		redbattle: function(target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<center><b><u>Red Battle Pokemon List</u></b><br /> <img src="http://i.imgur.com/umrMb0U.png" height="100%" width="100%"><br /><b>Red Banlist: Yveltal, Red Orb, Heat Rock, Blazikenite.</b><br /><b>Red Battle Format By: Prince Sky & Invincible Swampert');
	},
	skytest: function (target, room, user) {
		if (user.id !== 'princesky') return false;
		let colour = blue	('<center><strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong></center>');
	},

	spop: 'sendpopup',
	sendpopup: function(target, room, user) {
		if (!this.can('popup')) return false;

		target = this.splitTarget(target);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply('/sendpopup [user], [message] - You missed the user');
		if (!target) return this.sendReply('/sendpopup [user], [message] - You missed the message');

		targetUser.popup(target);
		this.sendReply(targetUser.name + ' got the message as popup: ' + target);

		targetUser.send(user.name+' sent a popup message to you.');

		this.logModCommand(user.name+' send a popup message to '+targetUser.name);
	},

	pic: 'image',
	image: function(target, room, user) {
		if (!target) return this.sendReply('/image [url] - Shows an image using /a. Requires ~.');
		return this.parse('/a |raw|<center><img src="' + target + '">');
	},
	dk: 'dropkick',
	dropkick: function(target, room, user) {
		if (!target) return this.sendReply('/dropkick needs a target.');
		return this.parse('/me dropkicks ' + target + ' across the Pok\u00E9mon Stadium!');
	},
	halloween: function(target, room, user) {
		if (!target) return this.sendReply('/halloween needs a target.');
		return this.parse('/me takes ' + target + '\'s pumpkin and smashes it all over the Pok\u00E9mon Stadium!');
	},
	barn: function(target, room, user) {
		if (!target) return this.sendReply('/barn needs a target.');
		return this.parse('/me has barned ' + target + ' from the entire server!');
	},
	lick: function(target, room, user) {
		if (!target) return this.sendReply('/lick needs a target.');
		return this.parse('/me licks ' + target + ' excessively!');
	},
		cmds: 'serverhelp',
	flameshelp: 'serverhelp',
	serverhelp: function (target, room, user, connection) {
		if (!this.canBroadcast()) return;
		if (user.isStaff) {
			connection.sendTo(room.id, '|raw|<div class="infobox"><center><b><u>List of <i>staff</i> commands:</u></b></center><br /><b>/clearall</b> - Clear all messages in the room.<br /><b>/endpoll</b> - End the poll in the room.<br /><b>/givemoney</b> <i>name</i>, <i>amount</i> - Give a user a certain amount of money.<br /><b>/hide</b> - Hide your staff symbol.<br /><b>/pmall</b> <i>message</i> - Private message all users in the server.<br /><b>/pmstaff</b> <i>message</i> - Private message all staff.<br /><b>/poll</b> <i>question</i>, <i>option 1</i>, <i>option 2</i>... - Create a poll where users can vote on an option.<br /><b>/reload</b> - Reload commands.<br /><b>/reloadfile</b> <i>file directory</i> - Reload a certain file.<br /><b>/resetmoney</b> <i>name</i> - Reset the user\'s money to 0.<br /><b>/rmall</b> <i>message</i> - Private message all users in the room.<br /><b>/show</b> - Show your staff symbol.<br /><b>/poll</b> <i>question</i>, <i>option 1</i>, <i>option 2</i>... - Create a strawpoll, declares the link to all rooms and pm all users in the server.<br /><b>/toggleemoticons</b> - Toggle emoticons on or off.<br /><b>/takemoney</b> <i>user</i>, <i>amount</i> - Take a certain amount of money from a user.<br /><b>/trainercard</b> <i>help</i> - Makes adding trainer cards EZ.<br /></div>');
		}
		if (!target || target === '1') {
			return this.sendReplyBox(
				"<center><b><u>List of commands (1/3):</u></b></center><br />" +
				"<b>/away</b> - Set yourself away.<br />" +
				"<b>/back</b> - Set yourself back from away.<br />" +
				"<b>/buy</b> <i>command</i> - Buys an item from the shop.<br />" +
				"<b>/customsymbol</b> <i>symbol</i> - Get a custom symbol.<br />" +
				"<b>/define</b> <i>word</i> - Shows the definition of a word.<br />" +
				"<b>/emotes</b> - Get a list of emoticons.<br />" +
				"<br />Use /cmds <i>number (1-3)</i> to see more commands."
			);
		}
		if (target === '2') {
			return this.sendReplyBox(
				"<center><b><u>List of commands (2/3):</u></b></center><br />" +
				"<b>/hangman</b> help - Help on hangman specific commands.<br />" +
				"<b>/poof</b> - Disconnects the user and leaves a message in the room.<br />" +
				"<b>/profile</b> - Shows information regarding user\'s name, group, money, and when they were last seen.<br />" +
				"<b>/regdate</b> <i>user</i> - Gets registration date of the user.<br />" +
				"<br />Use /cmds <i>number (1-3)</i> to see more commands."
			);
		}
		if (target === '3') {
			return this.sendReplyBox(
				"<center><b><u>List of commands (3/3):</u></b></center><br />" +
				"<b>/resetsymbol</b> - Reset custom symbol if you have one.<br />" +
				"<b>/richestusers</b> - Show the richest users.<br />" +
				"<b>/seen</b> <i>username</i> - Shows when the user last connected on the server.<br />" +
				"<b>/sell</b> <i>id</i> - Sells a card in the marketplace. Hover over your card to get the id.<br />" +
				"<b>/shop</b> - Displays the server\'s main shop.<br />" +
				"<b>/stafflist</b> - Shows the staff.<br />" +
				"<b>/tell</b> <i>username</i>, <i>message</i> - Send a message to an offline user that will be received when they log in.<br />" +
				"<b>/transfer</b> <i>user</i>, <i>amount</i> - Transfer a certain amount of money to a user.<br />" +
				"<b>/urbandefine</b> <i>word</i> - Shows the urban definition of the word.<br />" +
				"<b>/wallet</b> <i>user</i> - Displays how much money a user has. Parameter is optional.<br />" +
				"<br />Use /cmds <i>number (1-3)</i> to see more commands."
			);
		}
	},
	
};