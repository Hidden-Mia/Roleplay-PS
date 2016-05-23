exports.commands = {
    roomfounder: function (target, room, user) {
        if (!room.chatRoomData) {
            return this.sendReply("/roomfounder - This room isn\'t designed for per-room moderation to be added.");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('makeroom')) return false;
        if (!room.auth) room.auth = room.chatRoomData.auth = {};
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.auth[targetUser.userid] = '#';
        room.founder = targetUser.userid;
        this.addModCommand(name + ' was appointed to Room Founder by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.founder = room.founder;
        Rooms.global.writeChatRoomData();
    },

    roomdefounder: 'deroomfounder',
    deroomfounder: function (target, room, user) {
        if (!room.auth) {
            return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

        if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room founder.");
        if (!this.can('makeroom', null, room)) return false;

        delete room.auth[userid];
        delete room.founder;
        this.sendReply("(" + name + " is no longer Room Founder.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
        }
	},

	roomowner: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room owner.');
		if (room.founder !== user.userid && !this.can('makeroom')) return this.sendReply('/roomowner - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand("" + name + " was appointed Room Owner by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},
	roomownerhelp: ["/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~"],

	roomdeowner: 'deroomowner',
	deroomowner: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!room.founder || user.userid !== room.founder && !this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Owner.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomleader: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room owner.');
		if (room.founder !== user.userid && !this.can('makeroom')) return this.sendReply('/roomowner - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '&';
		this.addModCommand("" + name + " was appointed Room Leader by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},


	roomdeleader: 'deroomowner',
	deroomleader: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '&') return this.sendReply("User '"+name+"' is not a room leader.");
		if (!room.founder || user.userid !== room.founder && !this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Leader.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
        },

	leagueroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply('/leagueroom - This room can\'t be marked as a league');
		}
		if (target === 'off') {
			delete room.isLeague;
			this.addModCommand(user.name+' has made this chat room a normal room.');
			delete room.chatRoomData.isLeague;
			Rooms.global.writeChatRoomData();
		} else {
			room.isLeague = true;
			this.addModCommand(user.name+' made this room a league room.');
			room.chatRoomData.isLeague = true;
			Rooms.global.writeChatRoomData();
		}

	},

	closeleague: 'openleague',
	openleague: function (target, room, user, connection, cmd) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.can('roommod', null, room)) return false;
		if (!room.chatRoomData) {
			return this.sendReply("This room cannot have a league toggle option.");
		}
		if (cmd === 'closeleague') {
			if (!room.isOpen) return this.sendReply('The league is already marked as closed.');
			delete room.isOpen;
			delete room.chatRoomData.isOpen;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as closed.');
		}
		else {
			if (room.isOpen) return this.sendReply('The league is already marked as open.');
			room.isOpen = true;
			room.chatRoomData.isOpen = true;
			Rooms.global.writeChatRoomData();
			return this.sendReply('This league has now been marked as open.');
		}
	},

	leaguestatus: function (target, room, user) {
		if (!room.isLeague) return this.sendReply("This is not a league room, if it is, get a Leader or Admin to set the room as a league room.");
		if (!this.canBroadcast()) return;
		if (room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="green"><b>open</b></font> to challengers.');
		}
		else if (!room.isOpen) {
			return this.sendReplyBox(room.title+' is <font color="red"><b>closed</b></font> to challengers.');
		}
		else return this.sendReply('This league does not have a status set.');
	},

	roomstatus: function (target, room, user) {
		if (!room.chatRoomData) return false;
		if (!this.canBroadcast()) return false;
		if (room.isPublic && !room.isOfficial) {
			return this.sendReplyBox(room.title + ' is a <font color="green"><b>public</b></font> room.');
		} else if (!room.isPublic && !room.isOfficial) {
			return this.sendReplyBox(room.title + ' is <font color="red"><b>not</b></font> a public room.');
		}
		if (room.isOfficial && room.isPublic) {
			return this.sendReplyBox(room.title + ' is an <font color="blue"><b>official</b></font> room.');
		}
},
	randp: function (target, room, user) {
		var fs = require('fs');
		var fileName = "pokedex.js";
		if (!this.canBroadcast()) return;
		var shinyPoke = '';
		var x = '';
		if (/shiny/i.test(target)) {
			var shinyPoke = '-shiny';
		}
		var kanto = false; var johto = false; var hoenn = false; var sinnoh = false; var kalos = false; var unova = false;
		if (/kanto/i.test(target) || /gen 1/i.test(target)) {
			var kalos = true;
			var x = Math.floor(Math.random() * (174 - 1)) + 1;
		} else if (/johto/i.test(target) || /gen 2/i.test(target)) {
			var johto = true;
			var x = Math.floor(Math.random() * (281 - 173)) + 173;
		} else if (/hoenn/i.test(target) || /gen 3/i.test(target)) {
			var hoenn = true;
			var x = Math.floor(Math.random() * (444 - 280)) + 280;
		} else if (/sinnoh/i.test(target) || /gen 4/i.test(target)) {
			var sinnoh = true;
			var x = Math.floor(Math.random() * (584 - 443)) + 443;
		} else if (/kalos/i.test(target) || /gen 5/i.test(target)) {
			var kalos = true;
			var x = Math.floor(Math.random() * (755 - 583)) + 583;
		} else if (/unova/i.test(target) || /gen 6/i.test(target)) {
			var unova = true;
			var x = Math.floor(Math.random() * (834 - 752)) + 752;
		}
		if (kanto === false && johto === false && hoenn === false && sinnoh === false && kalos === false && unova === false) {
			var x = Math.floor(Math.random() * (856 - 1)) + 1;
		}
		var randP = '';
		var pokeNum = parseInt(x);
		var pokedex = fs.readFileSync('./data/pokedex.js').toString().split("\n");
		var pokemon = (pokedex[x]);
		var speciesIndex1 = pokemon.indexOf('species:"') + 9; var speciesIndex2 = pokemon.indexOf('",', speciesIndex1);
		var pokeName = pokemon.slice(speciesIndex1, speciesIndex2);
		var type1Index1 = pokemon.indexOf(',types:["') + 9; var type1Index2 = pokemon.indexOf('"],', type1Index1);
		var pokeType2 = '';
		if (/,/.test(pokemon.slice(type1Index1, type1Index2))) {
			var type1Index2 = pokemon.indexOf('","', type1Index1);
			var type2Index1 = pokemon.indexOf('","', type1Index1) + 3; var type2Index2 = pokemon.indexOf('"],', type2Index1);
			var pokeType2 = '<img src="http://play.pokemonshowdown.com/sprites/types/' + pokemon.slice(type2Index1, type2Index2) + '.png" width="32" height="14">';
		}
		var pokeType1 = '<img src="http://play.pokemonshowdown.com/sprites/types/' + pokemon.slice(type1Index1, type1Index2) + '.png" width="32" height="14">';
		var ability1Index1 = pokemon.indexOf(',abilities:{0:"') + 15; var ability1Index2 = pokemon.indexOf('"},h', ability1Index1);
		var pokeAbility2 = '';
		var pokeAbility3 = '';
		if (/",/.test(pokemon.slice(ability1Index1, ability1Index2))) {
			if (/",H:"/.test(pokemon.slice(ability1Index1, ability1Index2))) {
				var ability1Index2 = pokemon.indexOf('",H:"', ability1Index1);
				var ability3Index1 = pokemon.indexOf('",H:"', ability1Index1) + 5; var ability3Index2 = pokemon.indexOf('"', ability3Index1);
				var pokeAbility3 = ', ' + pokemon.slice(ability3Index1, ability3Index2);
			}
			if (/",1:"/.test(pokemon.slice(ability1Index1, ability1Index2))) {
				var ability1Index2 = pokemon.indexOf('",1:"', ability1Index1);
				var ability2Index1 = pokemon.indexOf('",1:"', ability1Index1) + 5; var ability2Index2 = pokemon.indexOf('"', ability2Index1);
				var pokeAbility2 = ', ' + pokemon.slice(ability2Index1, ability2Index2);
			}
		}
		var ability1Index2 = pokemon.indexOf('"', ability1Index1);
		var pokeAbility1 = pokemon.slice(ability1Index1, ability1Index2);
		var hpIndex1 = pokemon.indexOf('hp:') + 3; var hpIndex2 = pokemon.indexOf(',', hpIndex1);
		var pokeHp = parseInt(pokemon.slice(hpIndex1, hpIndex2));
		var atkIndex1 = pokemon.indexOf('atk:') + 4; var atkIndex2 = pokemon.indexOf(',', atkIndex1);
		var pokeAtk = parseInt(pokemon.slice(atkIndex1, atkIndex2));
		var defIndex1 = pokemon.indexOf('def:') + 4; var defIndex2 = pokemon.indexOf(',', defIndex1);
		var pokeDef = parseInt(pokemon.slice(defIndex1, defIndex2));
		var spaIndex1 = pokemon.indexOf('spa:') + 4; var spaIndex2 = pokemon.indexOf(',', spaIndex1);
		var pokeSpa = parseInt(pokemon.slice(spaIndex1, spaIndex2));
		var spdIndex1 = pokemon.indexOf('spd:') + 4; var spdIndex2 = pokemon.indexOf(',', spdIndex1);
		var pokeSpd = parseInt(pokemon.slice(spdIndex1, spdIndex2));
		var speIndex1 = pokemon.indexOf('spe:') + 4; var speIndex2 = pokemon.indexOf('}', speIndex1);
		var pokeSpe = parseInt(pokemon.slice(speIndex1, speIndex2));
		var pokeBst = pokeHp + pokeAtk + pokeDef + pokeSpa + pokeSpd + pokeSpe;
		var pokeStats = 'HP ' + pokeHp + ' / Atk ' + pokeAtk + ' / Def ' + pokeDef + ' / SpA ' + pokeSpa + ' / SpD ' + pokeSpd + ' / Spe ' + pokeSpe + ' / BST ' + pokeBst;
		var colorIndex1 = pokemon.indexOf(',color:"') + 8; var colorIndex2 = pokemon.indexOf('",', colorIndex1);
		var pokeColor = pokemon.slice(colorIndex1, colorIndex2);
		var egg1Index1 = pokemon.indexOf(',eggGroups:["') + 13; var egg1Index2 = pokemon.indexOf('"]', egg1Index1);
		var pokeEgg2 = "";
		if (/,/.test(pokemon.slice(egg1Index1, egg1Index2))) {
			var egg1Index2 = pokemon.indexOf('","', egg1Index1);
			var egg2Index1 = pokemon.indexOf('","', egg1Index1) + 3; var egg2Index2 = pokemon.indexOf('"]', egg2Index1);
			var pokeEgg2 = ", " + pokemon.slice(egg2Index1, egg2Index2);
		}
		var pokeEgg1 = pokemon.slice(egg1Index1, egg1Index2);
		if (pokeName === "Ho-Oh" || pokeName === "Nidoran-F" || pokeName === "Nidoran-M" || pokeName === "Farfetch'd" || pokeName === "Porygon-Z") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/' + pokeName.toLowerCase().replace(/[-]+/g, '').replace(/[']+/g, '') + '.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Basculin-Blue-Striped") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/basculin-bluestriped.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Pichu-Spiky-eared") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pichu-spikyeared.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Floette-Eternal-Flower") {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/floette-eternalflower.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		} else if (pokeName === "Missingno.") {
			var y = Math.floor(Math.random() * (6 - 1)) + 1;
			switch (y) {
			case 1:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/9/98/Missingno_RB.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 2:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/0/03/Missingno_Y.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 3:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/a/aa/Spr_1b_141_f.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 4:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/b/bb/Spr_1b_142_f.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 5:
				randP = '<table><tr><td><img src="http://cdn.bulbagarden.net/upload/9/9e/Ghost_I.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>None<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			default:
				break;
			}
		} else if (pokeName === "Pikachu-Cosplay") {
			var z = Math.floor(Math.random() * (6 - 1)) + 1;
			switch (z) {
			case 1:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-rock-star.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 2:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-belle.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 3:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-pop-star.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 4:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-phd.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			case 5:
				randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/pikachu-libre.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
				break;
			default:
				break;
			}
		} else {
			randP = '<table><tr><td><img src="http://play.pokemonshowdown.com/sprites/bw' + shinyPoke + '/' + pokeName.toLowerCase().replace(/[ ]+/g, '').replace(/[.]+/g, '').replace(/[']+/g, '') + '.png" height="96" width="96"></td><td><b>Name: </b>' + pokeName + '<br/><b>Type(s): </b>' + pokeType1 + ' ' + pokeType2 + '<br/><b>Ability: </b>' + pokeAbility1 + pokeAbility2 + pokeAbility3 + '<br/><b>Stats: </b>' + pokeStats + '<br/><b>Color: </b><font color="' + pokeColor + '">' + pokeColor + '</font><br/><b>Egg Group(s): </b>' + pokeEgg1 + pokeEgg2 + '</td></tr></table>';
		}
		this.sendReplyBox(randP);
	}
	};
