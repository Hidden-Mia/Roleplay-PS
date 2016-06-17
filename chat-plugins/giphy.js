'use strict';

const http = require('http');
const fs = require('fs');

	giphy: function (target, room, user) {
 		if (!target) return this.parse('/giphyhelp');
 		let tarId = toId(target);
 		let validTargets = ['cat', 'otter', 'dog', 'bunny', 'pokemon', 'kitten', 'puppy', 'anime'];
 		if (room.id === 'lobby' && !user.isStaff) return this.errorReply("This command cannot be broadcasted in the Lobby.");
 		if (!validTargets.includes(tarId)) return this.parse('/giphyhelp');
 		let self = this;
 		let reqOpt = {
 			hostname: 'api.giphy.com', // Do not change this
			path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + tarId,
 			method: 'GET',
        	};
 		let req = http.request(reqOpt, function (res) {
 			res.on('data', function (chunk) {
 				try {
 					let data = JSON.parse(chunk);
 					let output = '<center><img src="' + data.data["image_url"] + '" width="50%"></center>';
 					if (!self.runBroadcast()) return;
 					if (data.data["image_url"] === undefined) {
 						self.errorReply("ERROR CODE 404: No images found!");
 						return room.update();
 					} else {
 						self.sendReplyBox(output);
 						return room.update();
 					}
 				} catch (e) {
 					return self.errorReply("ERROR CODE 503: Giphy is unavaliable right now. Try again later.");
 					return room.update();
 				}
 			});
 		});
 		req.end();
 	},
 	giphyhelp: ['Giphy Plugin by DarkNightSkies & Kyv.n(♥)',
 		'/giphy cat - Displays a cat.',
		'/giphy kitten - Displays a kitten.',
 		'/giphy dog - Displays a dog.',
		'/giphy puppy - Displays a puppy.',
 		'/giphy bunny - Displays a bunny.',
 		'/giphy otter - Displays an otter.',
         	'/giphy pokemon - Displays a pokemon.',
 		'/giphy anime - Displays an anime',
 		'/giphy help - Displays this help box.',
 		]
};
