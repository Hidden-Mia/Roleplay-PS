'Use Strict';
exports.commands = {
        credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Gold Server Credits</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + Gold.nameColor('panpawn', true) + " (Founder, Sysadmin, Development, Lead Policy)<br />" +
					"<br />" +
					"<u>Development:</u><br />" +
					"- " + Gold.nameColor('panpawn', true) + " (Owner of GitHub repository)<br />" +
					"- " + Gold.nameColor('Silveee', true) + " (Contributor)<br />" +
					"- " + Gold.nameColor('jd', true) + " (Collaborator)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />" +
					"- " + Gold.nameColor('snow', true) + " (Policy administrator)<br />" +
					"- " + Gold.nameColor('pitcher', true) + " (Former co-owner)<br />" +
					"- " + Gold.nameColor('PixelatedPaw', true) + " (One of the original administrators)");
	},
};
Gold.pluralFormat = function(length, ending) {
	if (!ending) ending = 's';
	if (isNaN(Number(length))) return false;
	return (length == 1 ? '' : ending);
}
Gold.nameColor = function(name, bold) {
	return (bold ? "<b>" : "") + "<font color=" + Gold.hashColor(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Tools.escapeHTML(Users.getExact(name).name) : Tools.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
}
