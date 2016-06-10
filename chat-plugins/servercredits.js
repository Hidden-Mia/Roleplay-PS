'Use Strict';

/* Original code by panpawn! Modified for roleplau by Prince Sky!*/

var color = require('../config/color');
hashColor = function(name, bold) {
	return (bold ? "<b>" : "") + "<font color=" + color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Tools.escapeHTML(Users.getExact(name).name) : Tools.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
}

exports.commands = {
	credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Roleplay Credits</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + hashColor('Mia Flores', true) + " (Founder, Sysadmin)<br />" +
                    "- " + hashColor('Prince Sky', true) + " (Sysadmin, Host, Developer, Lead Policy)<br />" +
					"<br />" +
					"<u>Development:</u><br />" +
					"- " + hashColor('Mia Flores', true) + " (Owner of GitHub repository)<br />" +
					"- " + hashColor('Prince Sky', true) + " (Owner of Github repository, Server CSS)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />");
	},
};
