'use strict';
/* Friendcode commands by jd! status and nick name commands by prince sky */

exports.commands = {
        setstatus: 'statusset',
	statusset: function (target, room, user) {
		if (!target) return this.errorReply("Invalid command. Valid commands are `/setstatus status` and `/removesatus`.");
		let status = Tools.escapeHTML(target.trim());
		Db('userstatus').set(toId(user), status);
		this.sendReply("Status set.");
	},

	removestatus: 'statusremove',
	statusremove: function (target, room, user) {
		if (!Db('userstatus').has(toId(user))) return this.errorReply("You do not have a status use /setstatus [status] to set your status.");
		Db('friendcodes').delete(toId(user));
		this.sendReply("Status removed.");
	},

	fcadd: 'friendcodeadd',
	friendcodeadd: function (target, room, user) {
		if (!target) return this.errorReply("Invalid command. Valid commands are `/friendcodeadd code` and `/friendcoderemove`.");
		let fc = Tools.escapeHTML(target.trim());
		let reg = /^\d{4}-\d{4}-\d{4}$/;
		if (!reg.test(fc)) return this.errorReply("Invalid friend code, example: 3110-7818-5106");
		Db('friendcodes').set(toId(user), fc);
		this.sendReply("Friendcode set.");
	},

	fcrmv: 'friendcoderemove',
	fcdelete: 'friendcoderemove',
	friendcodecdelete: 'friendcoderemove',
	friendcoderemove: function (target, room, user) {
		if (!Db('friendcodes').has(toId(user))) return this.errorReply("You do not have a friendcode.");
		Db('friendcodes').delete(toId(user));
		this.sendReply('Friendcode removed.");
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
