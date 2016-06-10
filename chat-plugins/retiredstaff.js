'use strict';

global.isRetiredStaff = function (user) {
	if (!user) return;
	if (typeof user === 'Object') user = user.userid;
	let rs = Db('rstaff').get(toId(user));
	if (rs === 1) return true;
	return false;
};

exports.commands = {
		addrs: function (target, room, user) {
			if (!this.can('declare')) return false;
			let rsUser = toId(target);
			if (!rsUser) return this.parse('/help rs');
			if (isrs(rsUser)) return this.errorReply(rsUser + ' is already a retired staff');
			Db('rstaff').set(rsUser, 1);
			this.sendReply(rsUser + ' has been added to retired staff list.');
		},
		removers: function (target, room, user) {
			if (!this.can('declare')) return false;
			let rsUser = toId(target);
			if (!rsUser) return this.parse('/help rs ');
			if (!isrs(rsUser)) return this.errorReply(rsUser + ' is not a retired staff.');
			Db('rstaff').delete(rsUser);
			this.sendReply(rsUser + ' has been removed from retired staff list.');
		},
		viplist: function (target, room, user) {
			if (!this.can('declare')) return false;
			if (!Object.keys(Db('rstaff').object()).length) return this.errorReply('There seems to be no user in retired staff list.');
			this.sendReplyBox('<center><b><u>Vip Users</u></b></center>' + '<br /><br />' + Object.keys(Db('rstaff').object()).join('<br />'));
	},
};
