
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
		removerstaff: function (target, room, user) {
			if (!this.can('declare')) return false;
			let rstaffUser = toId(target);
			if (!rstaffUser) return this.parse('/help rstaff');
			if (!isRSTAFF(rstaffUser)) return this.errorReply(rstaffUser + ' is not a retired staff.');
			Db('rstafflist').delete(rstaffUser);
			this.sendReply(rstaffUser + ' has been removed from retired staff list');
		},
                rstaff: 'retiredstaff',
                retiredstaff: function (target, room, user) {
                        this.sendReplyBox("<center><b><u>Retired Staff Commands By: Prince Sky</u></b><br /><b>/addrstaff</b> - add retired staff.<br /><b>/removerstaff</b> - remove retired staff.<br /><b>/rstafflist</b> - shows retired staff list.<br />");
                },

		rstafflist: function (target, room, user) {
			if (!this.can('declare')) return false;
			if (!Object.keys(Db('rstafflist').object()).length) return this.errorReply('There seems to be no user in retired staff list.');
			this.sendReplyBox('<center><b><u>Retired Staff</u></b></center>' + '<br /><br />' + Object.keys(Db('rstafflist').object()).join('<br />'));
	},
};
