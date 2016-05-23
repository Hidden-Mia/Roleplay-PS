'use strict';

const permission = 'announce';


exports.commands = {

        tpoll: function(target, room, user) {
	             var tiers = [Battle Factory', 'Challenge Cup 1V1', 'Doubles OU', 'Gen 1 Random Battle', 'Monotype', 'OU', 'RU', 'UU' ];
		          this.parse('/poll new tournament?, ' + tiers);
	     },
};
