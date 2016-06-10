'use strict';

let fs = require('fs');
let path = require('path');

let rewardcentre = [
        ['Tiny Bucks Pack', 'Buys 5 bucks. (PM an Admin or leader immediately after purchase.)', 500],
        ['Small Bucks Pack', 'Buys 10 bucks. (PM an Admin or leader immediately after purchase.)', 1000],
        ['Normal Bucks Pack', 'Buys 15 bucks. (PM an Admin or leader immediately after purchase.)', 1500],
        ['Big Bucks Pack', 'Buys 30 bucks. ( Pm an Admin or Leader immediately after purchase. )', 300],
        ['Mega Bucks Pack', 'Buys 50 bucks. ( Pm an Admin or leader immediately after purchase )', 5000],
        ['1x PSGO', 'Buys 1 PSGO pack. (PM an Admin immediately after purchase.)', 1000],
	['3x PSGO', 'Buys 3 PSGO packs. (PM an Admin immediately after purchase.)', 2500],
    ['5x PSGO', 'Buys 5 PSGO packs. ( Pm an Admin immediately after purchase.)', 4000],
	['PSGO Booster Box', 'Buys 20 PSGO packs. (PM an Admin immediately after purchase.)', 14000],
	['Nickname', 'Buys a nickname that will be applied in your profile ( Special Item )', 15000],
	

];

let rewardcentreDisplay = getRewardCentreDisplay(rewardcentre);

/**
 * Gets an amount and returns the amount with the name of the currency.
 *
 * @examples
 * currencyName(0); // 0 bucks
 * currencyName(1); // 1 buck
 * currencyName(5); // 5 bucks
 *
 * @param {Number} amount
 * @returns {String}
 */
function currencyName(amount) {
	let name = " ticket";
	return amount === 1 ? name : name + "s";
}

/**
 * Checks if the money input is actually money.
 *
 * @param {String} money
 * @return {String|Number}
 */
function isTicket(ticket) {
	let numTicket = Number(ticket);
	if (isNaN(ticket)) return "Must be a number.";
	if (String(ticket).includes('.')) return "Cannot contain a decimal.";
	if (numTicket < 1) return "Cannot be less than one ticket.";
	return numTicket;
}

/**
 * Log money to logs/money.txt file.
 *
 * @param {String} message
 */
function logTicket(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/ticket.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

/**
 * Displays the shop
 *
 * @param {Array} shop
 * @return {String} display
 */
function getRewardCentreDisplay(rewardcentre) {
	let display = "<table border='1' cellspacing='0' cellpadding='5' width='100%'>" +
					"<tbody><tr><th>Command</th><th>Description</th><th>Cost</th></tr>";
	let start = 0;
	while (start < rewardcentre.length) {
		display += "<tr>" +
						"<td align='center'><button name='send' value='/win " + rewardcentre[start][0] + "'><b>" + rewardcentre[start][0] + "</b></button>" + "</td>" +
						"<td align='center'>" + rewardcentre[start][1] + "</td>" +
						"<td align='center'>" + rewardcentre[start][2] + "</td>" +
					"</tr>";
		start++;
	}
	display += "</tbody></table><center>To win an item from the shop, use /win <em>command</em>.</center>";
	return display;
}


/**
 * Find the item in the shop.
 *
 * @param {String} item
 * @param {Number} money
 * @return {Object}
 */
function findItem(item, ticket) {
	let len = rewardcentre.length;
	let price = 0;
	let amount = 0;
	while (len--) {
		if (item.toLowerCase() !== rewardcentre[len][0].toLowerCase()) continue;
		price = rewardcentre[len][2];
		if (price > ticket) {
			amount = price - ticket;
			this.errorReply("You don't have you enough tickets for this. You need " + amount + currencyName(amount) + " more to win " + item + ".");
			return false;
		}
		return price;
	}
	this.errorReply(item + " not found in reward center.");
}

/**
 * Handling the bought item from the shop.
 *
 * @param {String} item
 * @param {Object} user
 * @param {Number} cost - for lottery
 */
function handleBoughtItem(item, user, cost) {
	if (item === 'symbol') {
		user.canCustomSymbol = true;
		this.sendReply("You have purchased a custom symbol. You can use /customsymbol to get your custom symbol.");
		this.sendReply("You will have this until you log off for more than an hour.");
		this.sendReply("If you do not want your custom symbol anymore, you may use /resetsymbol to go back to your old symbol.");
	} else if (item === 'icon') {
		this.sendReply('You purchased an icon, contact an administrator to obtain the article.');
	} else {
		let msg = '**' + user.name + " has bought " + item + ".**";
		Rooms.rooms.staff.add('|c|~Shop Alert|' + msg);
		Rooms.rooms.staff.update();
		Users.users.forEach(function (user) {
			if (user.group === '~' || user.group === '&') {
				user.send('|pm|~Shop Alert|' + user.getIdentity() + '|' + msg);
			}
		});
	}
}

exports.commands = {
	tickets: 'tickets',
	coincase: 'tickets',
	tickets: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (!target) target = user.name;

		const amount = Db('ticket').get(toId(target), 0);
		this.sendReplyBox(Tools.escapeHTML(target) + " has " + amount + currencyName(amount) + ".");
	},
	ticketshelp: ["/tickets [user] - Shows the amount of money a user has."],

	giveticket: 'giveticket',
	giveticket: 'giveticket',
	giveticket: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help giveticket');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isTicket(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let total = Db('ticket').set(toId(username), Db('ticket').get(toId(username), 0) + amount).get(toId(username));
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " was given " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has given you " + amount + ". You now have " + total + ".");
		logTicket(username + " was given " + amount + " by " + user.name + ". " + username + " now has " + total);
	},
	givetickethelp: ["/giveticket [user], [amount] - Give a user a certain amount of tickets."],

	taketicket: 'taketicket',
	taketicket: 'taketicket',
	taketicket: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help taketicket');

		let parts = target.split(',');
		let username = parts[0];
		let amount = isTicket(parts[1]);

		if (typeof amount === 'string') return this.errorReply(amount);

		let total = Db('ticket').set(toId(username), Db('ticket').get(toId(username), 0) - amount).get(toId(username));
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " losted " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has taken " + amount + " from you. You now have " + total + ".");
		logTicket(username + " had " + amount + " taken away by " + user.name + ". " + username + " now has " + total);
	},
	taketickethelp: ["/taketicket [user], [amount] - Take a certain amount of tickets from a user."],

	resetticket: 'resetticket',
	resetticket: 'resetticket',
	resetticket: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		Db('ticket').set(toId(target), 0);
		this.sendReply(target + " now has 0 tickets.");
		logTicket(user.name + " reset the ticket of " + target + ".");
	},
	resettickethelp: ["/resetticket [user] - Reset user's tickets to zero."],

	transfertickets: 'transfertickets',
	transfertickets: 'transfertickets',
	transfertickets: 'transfertickets',
	transfertickets: function (target, room, user) {
		if (!target || target.indexOf(',') < 0) return this.parse('/help transfertickets');

		let parts = target.split(',');
		let username = parts[0];
		let uid = toId(username);
		let amount = isTicket(parts[1]);

		if (toId(username) === user.userid) return this.errorReply("You cannot transfer to yourself.");
		if (username.length > 19) return this.errorReply("Username cannot be longer than 19 characters.");
		if (typeof amount === 'string') return this.errorReply(amount);
		if (amount > Db('ticket').get(user.userid, 0)) return this.errorReply("You cannot transfer more tickets than what you have.");

		Db('ticket')
			.set(user.userid, Db('ticket').get(user.userid) - amount)
			.set(uid, Db('ticket').get(uid, 0) + amount);

		let userTotal = Db('ticket').get(user.userid) + currencyName(Db('ticket').get(user.userid));
		let targetTotal = Db('ticket').get(uid) + currencyName(Db('ticket').get(uid));
		amount = amount + currencyName(amount);

		this.sendReply("You have successfully transferred " + amount + ". You now have " + userTotal + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has transferred " + amount + ". You now have " + targetTotal + ".");
		logTicket(user.name + " transferred " + amount + " to " + username + ". " + user.name + " now has " + userTotal + " and " + username + " now has " + targetTotal + ".");
	},
	transfertickethelp: ["/transfertickets [user], [amount] - Transfer a certain amount of tickets to a user."],

	rewardcentre: 'rewardcentre',
	rewardcentre: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReply("|raw|" + rewardcentreDisplay);
	},
	rewardcentrehelp: ["/rewardcentre - Display items you can win with tickets."],

	win: function (target, room, user) {
		if (!target) return this.parse('/help win');
		let amount = Db('ticket').get(user.userid, 0);
		let cost = findItem.call(this, target, amount);
		if (!cost) return;
		let total = Db('ticket').set(user.userid, amount - cost).get(user.userid);
		this.sendReply("You have bought " + target + " for " + cost +  currencyName(cost) + ". You now have " + total + currencyName(total) + " left.");
		room.addRaw(user.name + " has bought <b>" + target + "</b> from the shop.");
		logTicket(user.name + " has bought " + target + " from the shop. This user now has " + total + currencyName(total) + ".");
		handleBoughtItem.call(this, target.toLowerCase(), user, cost);
	},
	winhelp: ["/win [command] - Wins an item from the shop."],

	customsymbol: function (target, room, user) {
		if (!user.canCustomSymbol && user.id !== user.userid) return this.errorReply("You need to buy this item from the shop.");
		if (!target || target.length > 1) return this.parse('/help customsymbol');
		if (target.match(/[A-Za-z\d]+/g) || '|?!+$%@\u2605=&~#\u03c4\u00a3\u03dd\u03b2\u039e\u03a9\u0398\u03a3\u00a9'.indexOf(target) >= 0) {
			return this.errorReply("Sorry, but you cannot change your symbol to this for safety/stability reasons.");
		}
		user.customSymbol = target;
		user.updateIdentity();
		user.canCustomSymbol = false;
		user.hasCustomSymbol = true;
	},
	customsymbolhelp: ["/customsymbol [symbol] - Get a custom symbol."],

	resetcustomsymbol: 'resetsymbol',
	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.errorReply("You don't have a custom symbol.");
		user.customSymbol = null;
		user.updateIdentity();
		user.hasCustomSymbol = false;
		this.sendReply("Your symbol has been reset.");
	},
	resetsymbolhelp: ["/resetsymbol - Resets your custom symbol."],

	ticketlog: function (target, room, user, connection) {
		if (!this.can('modlog')) return;
		target = toId(target);
		let numLines = 15;
		let matching = true;
		if (target.match(/\d/g) && !isNaN(target)) {
			numLines = Number(target);
			matching = false;
		}
		let topMsg = "Displaying the last " + numLines + " lines of transactions:\n";
		let file = path.join(__dirname, '../logs/ticket.txt');
		fs.exists(file, function (exists) {
			if (!exists) return connection.popup("No transactions.");
			fs.readFile(file, 'utf8', function (err, data) {
				data = data.split('\n');
				if (target && matching) {
					data = data.filter(function (line) {
						return line.toLowerCase().indexOf(target.toLowerCase()) >= 0;
					});
				}
				connection.popup('|wide|' + topMsg + data.slice(-(numLines + 1)).join('\n'));
			});
		});
	},

	ticketladder: 'luckiestuser',
	winnerladder: 'luckiestuser',
	luckiestusers: 'luckiestuser',
	luckiestuser: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let display = '<center><u><b>Richest Users</b></u></center><br><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Rank</th><th>Username</th><th>Tickets</th></tr>';
		let keys = Object.keys(Db('ticket').object()).map(function (name) {
			return {name: name, ticket: Db('ticket').get(name)};
		});
		if (!keys.length) return this.sendReplyBox("Ticket ladder is empty.");
		keys.sort(function (a, b) {
			return b.ticket - a.ticket;
		});
		keys.slice(0, 10).forEach(function (user, index) {
			display += "<tr><td>" + (index + 1) + "</td><td>" + user.name + "</td><td>" + user.ticket + "</td></tr>";
		});
		display += "</tbody></table>";
		this.sendReply("|raw|" + display);
	},

	numbergame: 'startnumber',
	numberstart: 'startnumber',
	startnumber: function (target, room, user) {
		if (!this.can('broadcast', null, room)) return false;
		if (!target) return this.parse('/help startnumber');
		if (!this.canTalk()) return this.errorReply("You can not start number games while unable to speak.");

		let amount = isTicket(target);

		if (typeof amount === 'string') return this.errorReply(amount);
		if (!room.number) room.number = {};
		if (room.number.started) return this.errorReply("A number game has already started in this room.");

		room.number.started = true;
		room.number.bet = amount;
		// Prevent ending a dice game too early.
		room.number.startTime = Date.now();

		room.addRaw("<div class='infobox'><h2><center><font color=#24678d>" + user.name + " has started a number game for </font><font color=red>" + amount + "</font><font color=#24678d>" + currencyName(amount) + ".</font><br><button name='send' value='/joinnumber'>Click to join.</button></center></h2></div>");
	},
	startnumberhelp: ["/startnumber [bet] - Start a dice game to gamble for tickets."],

	joinnumber: function (target, room, user) {
		if (!room.number || (room.number.p1 && room.number.p2)) return this.errorReply("There is no number game in it's signup phase in this room.");
		if (!this.canTalk()) return this.errorReply("You may not join number games while unable to speak.");
		if (room.number.p1 === user.userid) return this.errorReply("You already entered this number game.");
		if (Db('ticket').get(user.userid, 0) < room.number.bet) return this.errorReply("You don't have enough tickets to join this game.");
		Db('ticket').set(user.userid, Db('ticket').get(user.userid) - room.number.bet);
		if (!room.number.p1) {
			room.number.p1 = user.userid;
			room.addRaw("<b>" + user.name + " has joined the number game.</b>");
			return;
		}
		room.number.p2 = user.userid;
		room.addRaw("<b>" + user.name + " has joined the number game.</b>");
		let p1Number = Math.floor(6 * Math.random()) + 1;
		let p2Number = Math.floor(6 * Math.random()) + 1;
		let output = "<div class='infobox'>Game has two players, starting now.<br>Rolling the numbers.<br>" + room.number.p1 + " has rolled a " + p1Number + ".<br>" + room.number.p2 + " has rolled a " + p2Number + ".<br>";
		while (p1Number === p2Number) {
			output += "Tie... rolling again.<br>";
			p1Number = Math.floor(6 * Math.random()) + 1;
			p2Number = Math.floor(6 * Math.random()) + 1;
			output += room.number.p1 + " has rolled a " + p1Number + ".<br>" + room.number.p2 + " has rolled a " + p2Number + ".<br>";
		}
		let winner = room.number[p1Number > p2Number ? 'p1' : 'p2'];
		output += "<font color=#24678d><b>" + winner + "</b></font> has won <font color=#24678d><b>" + room.number.bet + "</b></font>" + currencyName(room.number.bet) + ".<br>Better luck next time " + room.number[p1Number < p2Number ? 'p1' : 'p2'] + "!</div>";
		room.addRaw(output);
		Db('ticket').set(winner, Db('ticket').get(winner, 0) + room.number.bet * 2);
		delete room.number;
	},

	endnumber: function (target, room, user) {
		if (!user.can('broadcast', null, room)) return false;
		if (!room.number) return this.errorReply("There is no number game in this room.");
		if ((Date.now() - room.number.startTime) < 15000 && !user.can('broadcast', null, room)) return this.errorReply("Regular users may not end a number game within the first minute of it starting.");
		if (room.number.p2) return this.errorReply("Number game has already started.");
		if (room.number.p1) Db('ticket').set(room.number.p1, Db('ticket').get(room.number.p1, 0) + room.number.bet);
		room.addRaw("<b>" + user.name + " ended the number game.</b>");
		delete room.number;
	},

	arcadestats: 'arcadestats',
	arcadestats: function (target, room, user) {
		if (!this.canBroadcast()) return;
		const users = Object.keys(Db('ticket').object());
		const total = users.reduce(function (acc, cur) {
			return acc + Db('ticket').get(cur);
		}, 0);
		let average = Math.floor(total / users.length);
		let output = "There is " + total + currencyName(total) + " circulating in the economy. ";
		output += "The average user has " + average + currencyName(average) + ".";
		this.sendReplyBox(output);
	},

};
