var fs = require('fs');

exports.commands = {
	restart: function(target, room, user) {
		if (this.can('eval') return;
		try {
			var forever = require('forever');
		} catch (e) {
			return this.sendReply("/restart requires the \"forever\" module.");
		}
		if (!Rooms.global.lockdown) {
			return this.sendReply("For safety reasons, /restart can only be used during lockdown.");
		}
		if (CommandParser.updateServerLock) {
			return this.sendReply("Wait for /updateserver to finish before using /restart.");
		}
		this.logModCommand(user.name + ' used /restart');
		Rooms.global.send('|refresh|');
		forever.restart('app.js');
	},
};
