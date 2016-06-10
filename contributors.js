'use strict';

/* Contributor Script By Prince Sky */

global.isCONTRIBUTOR = function (user) {
	if (!user) return;
	if (typeof user === 'Object') user = user.userid;
	let contributor = Db('contributorlist').get(toId(user));
	if (contributor === 1) return true;
	return false;
};

exports.commands = {
		addcontributor: function (target, room, user) {
			if (!this.can('declare')) return false;
			let contributorUser = toId(target);
			if (!contributorUser) return this.parse('/contributor');
			if (isCONTRIBUTOR(contributorUser)) return this.errorReply(contributorUser + ' is already a contributor.');
			Db('contributorlist').set(contributorUser, 1);
			this.sendReply(contributorUser + ' has been added in the contributor list.');
		},
		removecontributor: function (target, room, user) {
			if (!this.can('declare')) return false;
			let contributorUser = toId(target);
			if (!contributorUser) return this.parse('/contributor');
			if (!isCONTRIBUTOR(contributorUser)) return this.errorReply(contributorUser + ' is not a contributor.');
			Db('contributorlist').delete(contributorUser);
			this.sendReply(contributorUser + ' has been removed from the contributor list');
		},
		contributors: function (target, room, user) {
			if (!this.can('declare')) return false;
			if (!Object.keys(Db('contributorlist').object()).length) return this.errorReply('There seems to be no user in contributors list.');
			this.sendReplyBox('<center><b><u>Server Contributors</u></b></center>' + '<br /><br />' + Object.keys(Db('contributorlist').object()).join('<br />'));
	},
};
