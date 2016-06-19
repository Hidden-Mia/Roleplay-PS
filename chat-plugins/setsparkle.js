/*
* Created by: Master Float.
* Edited by: Kevinxzllz
* Edited to Sparkle By: Prince Sky
*/

'use strict';

let fs = require('fs');
let path = require('path');
let selectors;

function writeIconCSS() {
	fs.appendFile('config/custom.css', selectors);
}

function logMoney(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/money.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

exports.commands = {
	setsparkle: function (target, room, user) {
		if (!this.can('eval')) return this.errorReply("Access denied.");

		let args = target.split(',');
		if (args.length < 3) return this.parse('/help setsparkle');
		let username = toId(args.shift());
		let sparkle = 'background: url("' + args.shift().trim() + '");';
		selectors = '\n\n' + '  #' + toId(args.shift()) + '-userlist-user-' + username;
		args.forEach(function (room) {
			selectors += ', #' + toId(room) + '-userlist-user-' + username;
		});
		selectors += ' { \n' + '    ' + sparkle +  '\n  }';

		logMoney(user.name + " has set an sparkle to " + username + ".");
		this.privateModCommand("(" + user.name + " has set an sparkle to  " + username + ")");
		Rooms('staff').add('|raw|' + user.name + " has set an sparkle to " + username +  ".").update();
		writeIconCSS();
	},
	setsparklehelp: ["/setsparkle [username], [image], [room 1], [room 2], etc. - Sets an sparkle to a user in chosen rooms."],
};
