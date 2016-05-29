exports.commands = {
					
	leagueroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply('/leagueroom - This room can\'t be marked as a league');
		}
		if (target === 'off') {
			delete room.isLeague;
			this.addModCommand(user.name+' has made this chat room a normal room.');
			delete room.chatRoomData.isLeague;
			Rooms.global.writeChatRoomData();
		} else {
			room.isLeague = true;
			this.addModCommand(user.name+' made this room a league room.');
			room.chatRoomData.isLeague = true;
			Rooms.global.writeChatRoomData();
		}

	},

	closeleague: 'openleague',
	openleague: function (target, room, user, connection, cmd) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.can('roommod', null, room)) return false;
		if (!room.chatRoomData) {
			return this.sendReply("This room cannot have a league toggle option.");
		}
		if (cmd === 'closeleague') {
			if (!room.isOpen) return this.sendReply('The league is already marked as closed.');
			delete room.isOpen;
			delete room.chatRoomData.isOpen;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as closed.');
		}
		else {
			if (room.isOpen) return this.sendReply('The league is already marked as open.');
			room.isOpen = true;
			room.chatRoomData.isOpen = true;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as open.');
		}
	},

	leaguestatus: function (target, room, user) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.canBroadcast()) return;
		if (room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="green"><b>open</b></font> to challengers.');
		}
		else if (!room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="red"><b>closed</b></font> to challengers.');
		}
		else return this.sendReply('This league does not have a status set.');
	},

	roomstatus: function (target, room, user) {
		if (!room.chatRoomData) return false;
		if (!this.canBroadcast()) return false;
		if (room.isPublic && !room.isOfficial) {
			return this.sendReplyBox(room.title + ' is a <font color="green"><b>public</b></font> room.');
		} else if (!room.isPublic && !room.isOfficial) {
			return this.sendReplyBox(room.title + ' is <font color="red"><b>not</b></font> a public room.');
		}
		if (room.isOfficial && room.isPublic) {
			return this.sendReplyBox(room.title + ' is an <font color="blue"><b>official</b></font> room.');
		}
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

	toggleladdermessage: 'toggleladdermsg',
	toggleladdermessages: 'toggleladdermsg',
	toggleladdermsg: function (target, room, user) {
		if (room.id !== 'lobby') return this.errorReply('This command can only be used in Lobby.');
		if (!this.can('warn')) return false;
		room.disableLadderMessages = !room.disableLadderMessages;
		this.sendReply("Disallowing ladder messages is set to " + room.disableLadderMessages + " in this room.");
		if (room.disableLadderMessages) {
			this.add('|raw|<div class=\"broadcast-blue\"><b>Ladder messages are disabled!</b><br>The "Battle!" button will no longer send messages in the Lobby.</div>');
		} else {
			this.add('|raw|<div class=\"broadcast-red\"><b>Ladder messages are enabled!</b><br>The "Battle!" button will send messages in the Lobby.</div>');
		}
	},
	toggleladdermsghelp: ["/toggleladdermsg - Toggle ladder messages on or off."],

	togglebattlemessage: 'togglebattlemsg',
	togglebattlemessages: 'togglebattlemsg',
	togglebattlemsg: function (target, room, user) {
		if (!this.can('warn')) return false;
		if (Config.reportbattles === true) {
			setting = false;
			Config.reportbattles = setting;
			Simulator.SimulatorProcess.eval('Config.reportbattles = \'' + toId(setting) + '\'');
			this.add('|raw|<div class=\"broadcast-blue\"><b>Battle messages are disabled!</b><br>Battles will no longer be reported in the Lobby.</div>');
		} else {
			setting = true;
			Config.reportbattles = setting;
			Simulator.SimulatorProcess.eval('Config.reportbattles = \'' + toId(setting) + '\'');
			this.add('|raw|<div class=\"broadcast-red\"><b>Battle messages are enabled!</b><br>Battles will be reported in the Lobby.</div>');
		}
	},
	togglebattlemsghelp: ["/togglebattlemsg - Toggle battle messages on or off."],

	plain: 'plaintext',
	plaintext: function (target, room, user) {
		if (!target) return;
		if (!this.canBroadcast()) return;
		var originalVersion = target;
		var newVersion = target;
		newVersion = newVersion.replace(/[^a-zA-Z0-9]|\s+/g, "");
		this.sendReplyBox(
			"Original version: " + originalVersion + "<br />" +
			"Plain text version: " + newVersion
		);
	},

};
