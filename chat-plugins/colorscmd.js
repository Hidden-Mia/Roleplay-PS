'use strict';

/* Color Commands By Prince Sky */

let color = require('../config/color');

exports.commands = {
        staffcolor: function(target, room, user) {
            if (!this.can('eval')) return this.sendReply('You most be leader or admin to use this command!');
            target = target.split(',');
            if (!target[0]) return this.parse('/staffcolorhelp');
            if (!target[1]) return this.parse('/staffcolorhelp');
            if (!target[2]) return this.parse('/staffcolorhelp');
            this.sendReply('|raw|' + user.group + '<b><font color="' + color(toId(this.user.name)) + '">' + user.name + ':&nbsp;</font></b><font color="' + target[0] + '"><font face="' + target[1] + '">' + Tools.escapeHTML(target[2]) + '</font></font>');
         },
         staffcolorhelp: function(target, room, user) {
             this.sendReply('/staffcolor [COLOR],[FONT],[TEXT] - Post colored message.');
         },
};
