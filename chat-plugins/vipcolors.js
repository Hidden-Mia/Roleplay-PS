'use strict';

let color = require('../config/color');

exports.commands = {
        colortest: function(target, room, user) {
                   if (!target) return this.parse('/help bucksbet');
                   room.addRaw("<font color="' + color(user.userid) + ">:</font><font color="red"> ' + Tools.escapeHTML(message) + '</font>");
         },
};
