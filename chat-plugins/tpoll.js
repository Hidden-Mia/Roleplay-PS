'use strict';

const permission = 'announce';


exports.commands = {

        tourpoll: function(target, room, user) {
	             var tiers = ['Battle Factory', 'Challenge Cup 1v1', 'Gen 1 Random Battle', 'Monotype', 'Monotype Random Battle', 'OU', 'Ubers', 'UU' ];
		          this.parse('/poll create Tier of the next tournament?, ' + tiers);
	     },
};
