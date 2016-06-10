'Use Strict';

/* Original code by panpawn! Modified for roleplau by Prince Sky!*/

let color = require('../config/color');

exports.commands = {
	credit: 'credits',
	credits: function (target, room, user) {
		this.sendReplyBoz("|html|" + "<font size=5>Roleplay Credits</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + Gold.nameColor('Mia Flores', true) + " (Founder, Sysadmin)<br />" +
                                        "- " + Gold.nameColor('Prince Sky', true) + " (Sysadmin, Host, Developer, Lead Policy)<br />" +
					"<br />" +
					"<u>Development:</u><br />" +
					"- " + Gold.nameColor('Mia Flores', true) + " (Owner of GitHub repository)<br />" +
					"- " + Gold.nameColor('Prince Sky', true) + " (Owner of Github repository, Server CSS)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />");
	},
};
Gold.nameColor = function(name, bold) {
	return (bold ? "<b>" : "") + "<font color=" + color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Tools.escapeHTML(Users.getExact(name).name) : Tools.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
}
