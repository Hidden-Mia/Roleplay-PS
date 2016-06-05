'use strict';

const permission = 'announce';


exports.commands = {

        tourpoll: function(target, room, user) {
	             var tiers = ['Battle Factory', 'Challenge Cup 2v2', 'Gen 1 Random Battle', 'Haxmons', 'Monotype', 'Monotype Random Battle', 'NU', 'OU', 'RU', 'Super Staff Bros', 'Ubers', 'UU' ];
		          this.parse('/poll create Tier of the next tournament?, ' + tiers);
	     },
};
