
'use strict';

global.isRSTAFF = function (user) {
	if (!user) return;
	if (typeof user === 'Object') user = user.userid;
	let rstaff = Db('rstafflist').get(toId(user));
	if (rstaff === 1) return true;
	return false;
};

exports.commands = {
		addrstaff: function (target, room, user) {
			if (!this.can('declare')) return false;
			let rstaffUser = toId(target);
			if (!rstaffUser) return this.parse('/help rstaff');
			if (isRSTAFF(rstaffUser)) return this.errorReply(rstaffUser + ' is already a retired staff.');
			Db('rstafflist').set(rstaffUser, 1);
			this.sendReply(rstaffUser + ' has been added in the retired staff list.');
		},
		takevip: function (target, room, user) {
			if (!this.can('declare')) return false;
			let rstaffUser = toId(target);
			if (!rstaffUser) return this.parse('/help rstaff');
			if (!isRSTAFF(rstaffUser)) return this.errorReply(rstaffUser + ' is not a retired staff.');
			Db('rstafflist').delete(rstaffUser);
			this.sendReply(rstaffUser + ' has been removed from retired staff list');
		},
		rstafflist: function (target, room, user) {
			if (!this.can('declare')) return false;
			if (!Object.keys(Db('rstafflist').object()).length) return this.errorReply('There seems to be no user in retired staff list.');
			this.sendReplyBox('<center><b><u>Retired Staff</u></b></center>' + '<br /><br />' + Object.keys(Db('rstafflist').object()).join('<br />'));
	},
};
