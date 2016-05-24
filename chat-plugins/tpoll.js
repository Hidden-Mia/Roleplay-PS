'use strict';

const permission = 'announce';


exports.commands = {

        tpoll: function(target, room, user) {
	             var tiers = ['Monotype', 'OU', 'Doubles OU', 'UU', 'Challenge Cup 1v1', 'NU', 'Anything Goes', 'PU', 'Ubers', 'Random' ];
		          this.parse('/poll new tournament?, ' + tiers);
	     },
};
