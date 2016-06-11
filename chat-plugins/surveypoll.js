'Use strict';
/* Survey poll by Prince Sky */

var request = require('request');


exports.commands = {
        survey: 'surveypoll',
	surveypoll: function(target, room, user) {
		if (!user.can('broadcast', null, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
		if (room.question) return this.sendReply('There is currently a poll going on already.');
		if (!target) return false;
		if (target.length > 500) return this.sendReply('Polls can not be this long.');
		let separacion = "&nbsp;&nbsp;";
		let answers = target.split(',');
		let formats = [];
		for (let u in Tools.data.Formats) {
			if (Tools.data.Formats[u].name && Tools.data.Formats[u].challengeShow && Tools.data.Formats[u].mod != 'gen4' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen2' && Tools.data.Formats[u].mod != 'gen1') formats.push(Tools.data.Formats[u].name);
		}
		formats = 'Tournament,' + formats.join(',');
		if (answers[0] == 'tournament' || answers[0] == 'tour') answers = splint(formats);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
		let question = answers[0];
		question = Tools.escapeHTML(question);
		answers.splice(0, 1);
		answers = answers.join(',').toLowerCase().split(',');
		room.question = question;
		room.answerList = answers;
		room.usergroup = Config.groupsranking.indexOf(user.group);
		let output = '';
		for (let u in room.answerList) {
			if (!room.answerList[u] || room.answerList[u].length < 1) continue;
			output += '<button name="send" value="/vote ' + room.answerList[u] + '">' + Tools.escapeHTML(room.answerList[u]) + '</button>&nbsp;';
		}
		this.add('|raw|<div class="infobox"><h2>' + room.question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by ' + user.name + '</font size></i></small></font></h2><hr />' + separacion + separacion + output + '</div>');
	},
	vote: function(target, room, user) {
		let ips = JSON.stringify(user.ips);
		if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
		if (!target) return this.parse('/help vote');
		if (room.answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
		if (!room.answers) room.answers = new Object();
		room.answers[ips] = target.toLowerCase();
		return this.sendReply('You are now voting for ' + target + '.');
	},
	svote: 'surveyvote',
        surveyvote: function(target, room, user) {
		let ips = JSON.stringify(user.ips);
		if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
		if (!target) return this.parse('/help vote');
		if (room.answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
		if (!room.answers) room.answers = new Object();
		room.answers[ips] = target.toLowerCase();
		return this.sendReply('You are now voting for ' + target + '.');
	},
	es: 'endsurvey',
	endsurvey: function(target, room, user) {
		if (!user.can('broadcast', null, room)) return this.sendReply('You do not have enough authority to use this command.');
		if ((user.locked) && !user.can('bypassall')) return this.sendReply("You cannot do this while unable to talk.");
		if (!room.question) return this.sendReply('There is no poll to end in this room.');
		if (!room.answers) room.answers = new Object();
		let votes = Object.keys(room.answers).length;
		if (votes == 0) {
			room.question = undefined;
			room.answerList = new Array();
			room.answers = new Object();
			return this.add("|raw|<h3>The poll was canceled because of lack of voters.</h3>");
		}
		let options = new Object();
		let obj = Rooms.get(room);
		for (let i in obj.answerList) options[obj.answerList[i]] = 0;
		for (let i in obj.answers) options[obj.answers[i]] ++;
		let sortable = new Array();
		for (let i in options) sortable.push([i, options[i]]);
		sortable.sort(function(a, b) {
			return a[1] - b[1];
		});
		let html = "";
		for (let i = sortable.length - 1; i > -1; i--) {
			let option = sortable[i][0];
			let value = sortable[i][1];
			if (value > 0) html += "&bull; " + Tools.escapeHTML(option) + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
		}
		this.add('|raw|<div class="infobox"><h2>Results to "' + Tools.escapeHTML(obj.question) + '"<br /><i><font size=1 color = "#939393">Poll ended by ' + Tools.escapeHTML(user.name) + '</font></i></h2><hr />' + html + '</div>');
		room.question = undefined;
		room.answerList = new Array();
		room.answers = new Object();
	},
	
};
