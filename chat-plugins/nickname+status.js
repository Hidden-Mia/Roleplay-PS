'use strict';
/* commands by prince sky */

exports.commands = {
        setstatus: 'statusset',
	statusset: function (target, room, user) {
		if (!target) return this.errorReply("Invalid command. Valid commands are `/setstatus status` and `/removesatus`.");
		let status = Tools.escapeHTML(target.trim());
		if (status.length > 25) return this.errorReply("Titles may not be longer than 25 characters.");
		Db('status').set(toId(user), status);
		this.sendReply("Status set.");
	},

	removestatus: 'statusremove',
	statusremove: function (target, room, user) {
		if (!Db('status').has(toId(user))) return this.errorReply("You do not have a status use /setstatus [status] to set your status.");
		Db('friendcodes').delete(toId(user));
		this.sendReply("Status removed.");
	},

	setnn: 'setnickname',
	setnickname: function (target, room, user) {
		if (!target) return this.errorReply("Invalid command. Valid commands are `/setnickname [nickname] ` and `/removenickname`.");
		let nickname = Tools.escapeHTML(target.trim());
		Db('nicknames').set(toId(user), nickname);
		this.sendReply("Nickname set.");
	},

	removenn: 'removenickname'
	removenickname: function (target, room, user) {
		if (!Db('nicknames').has(toId(user))) return this.errorReply("You do not have a friendcode.");
		Db('nicknames').delete(toId(user));
		this.sendReply("Nickname removed.");
	},

};
