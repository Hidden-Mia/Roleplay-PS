const MAX_REASON_LENGTH = 300;
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var closeShop = false;
var closedShop = 0;
if (typeof Gold === 'undefined') global.Gold = {};
if (typeof Gold.tells === 'undefined') global.Gold.tells = {};
var crypto = require('crypto');
var inShop = ['symbol', 'custom', 'animated', 'room', 'trainer', 'fix', 'declare', 'musicbox', 'emote', 'color'];
var ipbans = fs.createWriteStream('config/ipbans.txt', {
	'flags': 'a'
});
var badges = fs.createWriteStream('badges.txt', {
	'flags': 'a'
});
exports.commands = {
	arlert: 'alert',	
	alert: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target || !targetUser) return this.sendReply("/alert user, message: Sends a popup to a user. Requires &~");
		if (!targetUser || !targetUser.connected) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		msg = Tools.escapeHTML(user.name) + " has sent you an alert (" + new Date().toUTCString() + "): " + target;
		if (target.length > 500) return this.sendReply("ERROR - alert is too long.");
		if (!targetUser.connected) return this.sendReply(targetUser + " not found.  Check spelling?");
		targetUser.popup(msg);
	},

	autojoinroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (target === 'off') {
			delete room.autojoin;
			this.addModCommand("" + user.name + " removed this room from the autojoin list.");
			delete room.chatRoomData.autojoin;
			Rooms.global.writeChatRoomData();
		} else {
			room.autojoin = true;
			this.addModCommand("" + user.name + " added this room to the autojoin list.");
			room.chatRoomData.autojoin = true;
			Rooms.global.writeChatRoomData();
		}
	},
	hide: 'hideauth',
	hideauth: function(target, room, user) {
		if (!user.can('lock')) return this.sendReply("/hideauth - access denied.");
		var tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target != '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			} else {
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				var room = Rooms.rooms[roomid];
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return tar + this.name;
		}
		user.updateIdentity();
		this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
		this.logModCommand(user.name + ' is hiding auth symbol as \'' + tar + '\'');
	},
	show: 'showauth',
	showauth: function(target, room, user) {
		if (!user.can('lock')) return this.sendReply("/showauth - access denied.");
		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply("You have now revealed your auth symbol.");
		return this.logModCommand(user.name + " has revealed their auth symbol.");
		this.sendReply("Your symbol has been reset.");
	},
	pb: 'permaban',
	pban: 'permaban',
	permban: 'permaban',
	permaban: function(target, room, user) {
		if (!target) return this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
		if (!this.can('pban')) return false;
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User ' + this.targetUsername + ' not found.');
		}
		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = " but was already banned";
			return this.privateModCommand('(' + targetUser.name + " would be banned by " + user.name + problem + '.) (' + targetUser.latestIp + ')');
		}
		targetUser.popup(user.name + " has permanently banned you.");
		this.addModCommand(targetUser.name + " was permanently banned by " + user.name + ".");
		this.add('|unlink|hide|' + this.getLastIdOf(targetUser));
		targetUser.ban();
		ipbans.write('\n' + targetUser.latestIp);
	},
	pbl: 'pbanlist',
	permabanlist: 'pbanlist',
	pbanlist: function(target, room, user, connection) {
		if (!this.canBroadcast() || !user.can('lock')) return this.sendReply('/pbanlist - Access Denied.');
		var pban = fs.readFileSync('config/pbanlist.txt', 'utf8');
		return user.send('|popup|' + pban);
	},
	dicehelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'Dice game commands: <br />' + 
			'/startdice <bet> - Starts a game.<br />' + 
			'/joindice - Joins the game.<br />' + 
			'/enddice - Forcibly ends the game.'
			
		);
	},
	bitch: 'complain',
	report: 'complain',
	complain: function(target, room, user) {
		if (!target) return this.sendReply('/report [report] - Use this command to report other users.');
		var html = ['<img ', '<a href', '<font ', '<marquee', '<blink', '<center'];
		for (var x in html) {
			if (target.indexOf(html[x]) > -1) return this.sendReply('HTML is not supported in this command.');
		}
		if (target.length > 350) return this.sendReply('This report is too long; it cannot exceed 350 characters.');
		if (!this.canTalk()) return;
		Rooms.rooms.staff.add(user.userid + ' (in ' + room.id + ') has reported: ' + target + '');
		this.sendReply('Your report "' + target + '" has been reported.');
		for (var u in Users.users)
			if ((Users.users[u].group == "~" || Users.users[u].group == "&" || Users.users[u].group == "@" || Users.users[u].group == "%") && Users.users[u].connected)
				Users.users[u].send('|pm|~Server|' + Users.users[u].getIdentity() + '|' + user.userid + ' (in ' + room.id + ') has reported: ' + target + '');
	},
	dm: 'daymute',
	daymute: function (target, room, user, connection, cmd) {
		if (!target) return this.errorReply()
		if (room.isMuted(user) && !user.can('bypassall')) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.sendReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}

		var muteDuration = 24 * 60 * 60 * 1000;
		if (!this.can('mute', targetUser, room)) return false;
		var canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			var problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for 24 hours. " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for 24 hours." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModCommand("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");
		this.add('|unlink|' + this.getLastIdOf(targetUser));

		room.mute(targetUser, muteDuration, false);
	},
	hide: 'hideauth',
	hideauth: function(target, room, user) {
		if (!user.can('lock')) return this.sendReply("/hideauth - access denied.");
		var tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target != '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			} else {
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				var room = Rooms.rooms[roomid];
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return tar + this.name;
		}
		user.updateIdentity();
		this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
		this.logModCommand(user.name + ' is hiding auth symbol as \'' + tar + '\'');
	},
	show: 'showauth',
	showauth: function(target, room, user) {
		if (!user.can('lock')) return this.sendReply("/showauth - access denied.");
		delete user.getIdentity;
		user.updateIdentity();
		this.sendReply("You have now revealed your auth symbol.");
		return this.logModCommand(user.name + " has revealed their auth symbol.");
		this.sendReply("Your symbol has been reset.");
},
    cmds: 'serverhelp',
    sfshelp: 'serverhelp',
    serverhelp: function(target, room, user, connection) {
        if (!this.canBroadcast()) return;
        if (user.isStaff) {
            connection.sendTo(room.id, '|raw|<div class="infobox">\
            <center><b><u>List of <i>staff</i> commands:</u></b></center><br>\
            <b>/clearall</b> - Clear all messages in the room.<br>\
            <b>/endpoll</b> - End the poll in the room.<br>\
            <b>/givemoney</b> <i>name</i>, <i>amount</i> - Give a user a certain amount of money.<br>\
            <b>/givepack</b> <i>user</i>, <i>pack</i> - Give a user a pack.<br>\
            <b>/hide</b> - Hide your staff symbol.<br>\
            <b>/pmall</b> <i>message</i> - Private message all users in the server.<br>\
            <b>/pmstaff</b> <i>message</i> - Private message all staff.<br>\
            <b>/poll</b> <i>question</i>, <i>option 1</i>, <i>option 2</i>... - Create a poll where users can vote on an option.<br>\
            <b>/resetmoney</b> <i>name</i> - Reset the user\'s money to 0.<br>\
            <b>/rmall</b> <i>message</i> - Private message all users in the room.<br>\
            <b>/show</b> - Show your staff symbol.<br>\
            <b>/strawpoll</b> <i>question</i>, <i>option 1</i>, <i>option 2</i>... - Create a strawpoll, declares the link to all rooms and pm all users in the server.<br>\
            <b>/toggleemoticons</b> - Toggle emoticons on or off.<br>\
            <b>/takemoney</b> <i>user</i>, <i>amount</i> - Take a certain amount of money from a user.<br>\
            <b>/trainercard</b> <i>help</i> - Makes adding trainer cards EZ.<br>\
                </div>');
        }
        if (!target || target === '1') {
            return this.sendReplyBox('\
            <center><b><u>List of commands (1/3):</u></b></center><br>\
            <b>/away</b> - Set yourself away.<br>\
            <b>/back</b> - Set yourself back from away.<br>\
            <b>/buy</b> <i>command</i> - Buys an item from the shop.<br>\
            <b>/customsymbol</b> <i>symbol</i> - Get a custom symbol.<br>\
            <b>/define</b> <i>word</i> - Shows the definition of a word.<br>\
            <b>/emotes</b> - Get a list of emoticons.<br>\
            <b>/hangman</b> help - Help on hangman specific commands.<br><br>\
            Use /cmds <i>number</i> to see more commands.\
            ');
        }
        if (target === '2') {
            return this.sendReplyBox('\
            <center><b><u>List of commands (2/3):</u></b></center><br>\
            <b>/poof</b> - Disconnects the user and leaves a message in the room.<br>\
            <b>/profile</b> - Shows information regarding user\'s name, day they were registered, and group.<br>\
            <b>/regdate</b> <i>user</i> - Gets registration date of the user.<br>\
            <b>/resetsymbol</b> - Reset custom symbol if you have one.<br>\
            <b>/richestusers</b> - Show the richest users.<br><br>\
            Use /cmds <i>number</i> to see more commands.\
            ');
        }
        if (target === '3') {
            return this.sendReplyBox('\
            <center><b><u>List of commands (3/3):</u></b></center><br>\
            <b>/seen</b> <i>username</i> - Shows when the user last connected on the server.<br>\
            <b>/shop</b> - Displays the server\'s main shop.<br>\
            <b>/stafflist</b> - Shows the staff.<br>\
            <b>/tell</b> <i>username</i>, <i>message</i> - Send a message to an offline user that will be received when they log in.<br>\
            <b>/transfer</b> <i>user</i>, <i>amount</i> - Transfer a certain amount of money to a user.<br>\
            <b>/urbandefine</b> <i>word</i> - Shows the urban definition of the word.<br>\
            <b>/wallet</b> <i>user</i> - Displays how much money a user has. Parameter is optional.<br><br>\
            Use /cmds <i>number</i> to see more commands.\
            ');
        }
    
	},
	namelock: 'nl',
	nl: function(target, room, user) {
		if (!this.can('ban')) return false;
		target = this.splitTarget(target);
		targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('/namelock - Lock a user into a username.');
		}
		if (targetUser.namelock === true) {
			return this.sendReply("The user " + targetUser + " is already namelocked.");
		}
		targetUser.namelock = true;
		return this.sendReply("The user " + targetUser + " is now namelocked.");
	},
	unnamelock: 'unl',
	unl: function(target, room, user) {
		if (!this.can('ban')) return false;
		target = this.splitTarget(target);
		targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('/unnamelock - Unlock a user from a username.');
		}
		if (targetUser.namelock === false) {
			return this.sendReply("The user " + targetUser + " is already un-namelocked.");
		}
		targetUser.namelock = false;
		return this.sendReply("The user " + targetUser + " is now un-namelocked.");
	},
	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help gdeclare');
		if (!this.can('lockdown')) return false;
		var roomName = (room.isPrivate) ? 'a private room' : room.id;
		if (cmd === 'gdeclare') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		}
		if (cmd === 'gdeclarered') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		} else if (cmd === 'gdeclaregreen') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		}
		f
		this.logEntry(user.name + ' used /gdeclare');
	},
	gdeclarered: 'gdeclare',
	gdeclaregreen: 'gdeclare',
	gdeclare: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help gdeclare');
		if (!this.can('lockdown')) return false;
		var roomName = (room.isPrivate) ? 'a private room' : room.id;
		if (cmd === 'gdeclare') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		}
		if (cmd === 'gdeclarered') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		} else if (cmd === 'gdeclaregreen') {
			for (var id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b><font size=1><i>Global declare from ' + roomName + '<br /></i></font size>' + target + '</b></div>');
			}
		}
		this.logModCommand(user.name + ' globally declared ' + target);
	},
	declaregreen: 'declarered',
	declarered: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		if (cmd === 'declarered') {
			this.add('|raw|<div class="broadcast-red"><b>' + target + '</b></div>');
		} else if (cmd === 'declaregreen') {
			this.add('|raw|<div class="broadcast-green"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + ' declared ' + target);
	},
	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function(target, room, user) {
		if (!target) return this.sendReply('/declaremod [message] - Also /moddeclare and /modmsg');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		this.privateModCommand('|raw|<div class="broadcast-red"><b><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</b></div>');
		this.logModCommand(user.name + ' mod declared ' + target);
	},
	flogout: 'forcelogout',
	forcelogout: function(target, room, user) {
		if (!user.can('hotpatch')) return;
		if (!this.canTalk()) return false;
		if (!target) return this.sendReply('/forcelogout [username], [reason] OR /flogout [username], [reason] - You do not have to add a reason');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User ' + this.targetUsername + ' not found.');
		}
		if (targetUser.can('hotpatch')) return this.sendReply('You cannot force logout another Admin - nice try. Chump.');
		this.addModCommand('' + targetUser.name + ' was forcibly logged out by ' + user.name + '.' + (target ? " (" + target + ")" : ""));
		targetUser.resetName();
	},
	pus: 'pmupperstaff',
	pmupperstaff: function(target, room, user) {
		if (!target) return this.sendReply('/pmupperstaff [message] - Sends a PM to every upper staff');
		if (!this.can('pban')) return false;
		for (var u in Users.users) {
			if (Users.users[u].group == '~' || Users.users[u].group == '&') {
				Users.users[u].send('|pm|~Upper Staff PM|' + Users.users[u].group + Users.users[u].name + '| ' + target + ' (PM from ' + user.name + ')');
			}
		}
	},
	regdate: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		if (!target || target === "0") target = toId(user.userid);
		if (!target || target === "." || target === "," || target === "'") return this.sendReply('/regdate - Please specify a valid username.'); //temp fix for symbols that break the command
		var username = toId(target);
		target = target.replace(/\s+/g, '');
		var request = require("request");
		var self = this;
		request('http://pokemonshowdown.com/users/~' + target, function(error, response, content) {
			if (!(!error && response.statusCode == 200)) return;
			content = content + '';
			content = content.split("<em");
			if (content[1]) {
				content = content[1].split("</p>");
				if (content[0]) {
					content = content[0].split("</em>");
					if (content[1]) {
						regdate = content[1].split('</small>')[0] + '.';
						data = Tools.escapeHTML(username) + ' was registered on' + regdate;
					}
				}
			} else {
				data = Tools.escapeHTML(username) + ' is not registered.';
			}
			self.sendReplyBox(Tools.escapeHTML(data));
		});
	},
	helixfossil: 'm8b',
	helix: 'm8b',
	magic8ball: 'm8b',
	m8b: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var random = Math.floor(20 * Math.random()) + 1;
		var results = '';
		if (random == 1) {
			results = 'Signs point to yes.';
		}
		if (random == 2) {
			results = 'Yes.';
		}
		if (random == 3) {
			results = 'Reply hazy, try again.';
		}
		if (random == 4) {
			results = 'Without a doubt.';
		}
		if (random == 5) {
			results = 'My sources say no.';
		}
		if (random == 6) {
			results = 'As I see it, yes.';
		}
		if (random == 7) {
			results = 'You may rely on it.';
		}
		if (random == 8) {
			results = 'Concentrate and ask again.';
		}
		if (random == 9) {
			results = 'Outlook not so good.';
		}
		if (random == 10) {
			results = 'It is decidedly so.';
		}
		if (random == 11) {
			results = 'Better not tell you now.';
		}
		if (random == 12) {
			results = 'Very doubtful.';
		}
		if (random == 13) {
			results = 'Yes - definitely.';
		}
		if (random == 14) {
			results = 'It is certain.';
		}
		if (random == 15) {
			results = 'Cannot predict now.';
		}
		if (random == 16) {
			results = 'Most likely.';
		}
		if (random == 17) {
			results = 'Ask again later.';
		}
		if (random == 18) {
			results = 'My reply is no.';
		}
		if (random == 19) {
			results = 'Outlook good.';
		}
		if (random == 20) {
			results = 'Don\'t count on it.';
		}
		return this.sendReplyBox('' + results + '');
	},
	color: function(target, room, user) {
		if (!this.canBroadcast()) return;
		if (target === 'list' || target === 'help' || target === 'options') {
			return this.sendReplyBox('The random colors are: <b><font color="red">Red</font>, <font color="blue">Blue</font>, <font color="orange">Orange</font>, <font color="green">Green</font>, <font color="teal">Teal</font>, <font color="brown">Brown</font>, <font color="black">Black</font>, <font color="purple">Purple</font>, <font color="pink">Pink</font>, <font color="gray">Gray</font>, <font color="tan">Tan</font>, <font color="gold">Gold</font>, <font color=#CC0000>R</font><font color=#AE1D00>a</font><font color=#913A00>i</font><font color=#745700>n</font><font color=#577400>b</font><font color=#3A9100>o</font><font color=#1DAE00>w</font>.');
		}
		var colors = ['Red', 'Blue', 'Orange', 'Green', 'Teal', 'Brown', 'Black', 'Purple', 'Pink', 'Grey', 'Tan', 'Gold'];
		var results = colors[Math.floor(Math.random() * colors.length)];
		if (results == 'Rainbow') {
			return this.sendReply('The random color is :<b><font color=#CC0000>R</font><font color=#AE1D00>a</font><font color=#913A00>i</font><font color=#745700>n</font><font color=#577400>b</font><font color=#3A9100>o</font><font color=#1DAE00>w</font></b>');
		} else {
			return this.sendReplyBox('The random color is:<b><font color=' + results + '>' + results + '</font></b>');
		}
	},
	deletecode: function(target, room, user) {
		if (!target) {
			return this.sendReply('/deletecode [user] - Deletes the Friend Code of the User.');
		}
		t = this;
		if (!this.can('lock')) return false;
		fs.readFile('config/friendcodes.txt', 'utf8', function(err, data) {
			if (err) console.log(err);
			hi = this;
			var row = ('' + data).split('\n');
			match = false;
			line = '';
			for (var i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				var line = row[i].split(':');
				if (target === line[0]) {
					match = true;
					line = row[i];
				}
				break;
			}
			if (match === true) {
				var re = new RegExp(line, 'g');
				var result = data.replace(re, '');
				fs.writeFile('config/friendcodes.txt', result, 'utf8', function(err) {
					if (err) t.sendReply(err);
					t.sendReply('The Friendcode ' + line + ' has been deleted.');
				});
			} else {
				t.sendReply('There is no match.');
			}
		});
	},
};

function splint(target) {
	//splittyDiddles
	var cmdArr = target.split(",");
	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
	return cmdArr;
}

function readMoney(user) {
	try {
		var data = fs.readFileSync('config/money.csv', 'utf8');
	} catch (e) {
		return 0;
	}
	var rows = data.split("\n");
	var matched = false;
	for (var i = 0; i < rows.length; i++) {
		if (!rows[i]) continue;
		var parts = rows[i].split(",");
		var userid = toId(parts[0]);
		if (user === userid) {
			var matched = true;
			var amount = Number(parts[1]);
			break;
		}
	}
	if (matched === true) {
		return amount;
	} else {
		return 0;
	}
}
exports.readMoney = readMoney;

function writeMoney(filename, user, amount, callback) {
	if (!filename || !user || !amount) return false;
	fs.readFile('config/' + filename + '.csv', 'utf8', function(err, data) {
		if (err) return false;
		if (!data || data == '') return console.log('DEBUG: (' + Date() + ') ' + filename + '.csv appears to be empty...');
		var row = data.split('\n');
		var matched = false;
		var line = '';
		var userMoney = 0;
		for (var i = 0; i < row.length; i++) {
			if (!row[i]) continue;
			var parts = row[i].split(',');
			var userid = toId(parts[0]);
			if (toId(user) == userid) {
				matched = true;
				userMoney = Number(parts[1]);
				line = row[i];
				break;
			}
		}
		userMoney += amount;
		if (matched == true) {
			var re = new RegExp(line, "g");
			var result = data.replace(re, toId(user) + ',' + userMoney);
			fs.writeFile('config/' + filename + '.csv', result, 'utf8', function(err) {
				if (err) return false;
				if (callback) callback(true);
				return;
			});
		} else {
			fs.appendFile('config/' + filename + '.csv', '\n' + toId(user) + ',' + userMoney);
			if (callback) callback(true);
			return;
		}
	});
}
exports.writeMoney = writeMoney;

//here you go panpan
//~stevoduhpedo
Object.merge(Gold, {
	hasBadge: function(user, badge) {
		var data = fs.readFileSync('badges.txt', 'utf8');
		var row = data.split('\n');
		var badges = '';
		for (var i = row.length; i > -1; i--) {
			if (!row[i]) continue;
			var split = row[i].split(':');
			if (split[0] == toId(user)) {
				if (split[1].indexOf(badge) > -1) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
});

function logTransaction (message) {
	if (!message) return false;
	fs.appendFile('logs/transactions.log','['+new Date().toUTCString()+'] '+message+'\n');
}

function getAvatar(user) {
	if (!user) return false;
	var user = toId(user);
	var data = fs.readFileSync('config/avatars.csv', 'utf8');
	var line = data.split('\n');
	var count = 0;
	var avatar = 1;
	for (var u = 1; u > line.length; u++) {
		if (line[u].length < 1) continue;
		column = line[u].split(',');
		if (column[0] == user) {
			avatar = column[1];
			break;
		}
	}
	for (var u in line) {
		count++;
		if (line[u].length < 1) continue;
		column = line[u].split(',');
		if (column[0] == user) {
			avatar = column[1];
			break;
		}
	}
	return avatar;
}

function htmlfix(target) {
    var fixings = ['<3', ':>', ':<'];
    for (var u in fixings) {
        while (target.indexOf(fixings[u]) != -1)
            target = target.substring(0, target.indexOf(fixings[u])) + '< ' + target.substring(target.indexOf(fixings[u]) + 1);
    }
    return target;
}
