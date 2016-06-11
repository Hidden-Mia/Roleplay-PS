/*
Emoticon plugin
This plugin allows you to use emoticons in both chat rooms (as long as they are enabled in the room) and private messages.

Adding this plugin to your server is fairly simple.
1) Add this file to your chat-plugins folder.
2) Open the rooms.js file in your favourite text editor and replace this.add('|c|' + user.getIdentity(this.id) + '|' + message); with:
    var emoticons = parseEmoticons(user.getIdentity(this.roomid), message);
    if (emoticons && !room.disableEmoticons) {
        this.addRaw(emoticons);
    } else {
        this.add('|c|' + user.getIdentity(this.id) + '|' + message);
    }

3) Open the commands.js file and find "var message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;"
    Once you find that line place the following above it:
    var emoticons = parseEmoticons(user.getIdentity(room.id), target);
    if (emoticons) {
        target = "/html " + emoticons;
    }
*/

var fs = require('fs');
var emoticons = {'feelsbd': 'http://i.imgur.com/TZvJ1lI.png'};
var emoteRegex = new RegExp('feelsbd', 'g');

function loadEmoticons () {
    try {
        emoticons = JSON.parse(fs.readFileSync('config/emoticons.json', 'utf8'));
        emoteRegex = [];
        for (var emote in emoticons) {
            emoteRegex.push(escapeRegExp(emote));
        }
        emoteRegex = new RegExp('(' + emoteRegex.join('|') + ')', 'g');
    } catch (e) {}
}
loadEmoticons();

function saveEmoticons () {
    fs.writeFileSync('config/emoticons.json', JSON.stringify(emoticons));
    emoteRegex = [];
    for (var emote in emoticons) {
        emoteRegex.push(emote);
    }
    emoteRegex = new RegExp('(' + emoteRegex.join('|') + ')', 'g');
}

function parseEmoticons (user, message) {
    var html = user.charAt(0) + '<button class="astext" name="parseCommand" value="/user ' + toId(user) + '">' + '<b><font color="' + hashColor(toId(user)) + '">' + Tools.escapeHTML(user.substr(1)) + ':</font></b></button> ';
	if (emoteRegex.test(message)) {
			message = Tools.escapeHTML(message).replace(emoteRegex, function (match) {
			return '<img src=' + emoticons[match] + '>';
		});
		return html + message;
	}
	return false;
}
global.parseEmoticons = parseEmoticons;


exports.commands = {
    emoticons: 'emoticon',
    emote: 'emoticon',
    emotes: 'emoticon',
    emoticon: function (target, room, user) {
        if (!target) target = 'help';
        var parts = target.split(',');
        for (var u in parts) parts[u] = parts[u].trim();
 
        switch (parts[0]) {
            case 'add':
                if (!parts[2]) return this.sendReply("Usage: /emoticon add, [name], [url] - Remember to resize the image first! (recommended 30x30)");
                if (emoticons[parts[1]]) return this.sendReply("\"" + parts[1] + "\" is already an emoticon.");
                emoticons[parts[1]] = parts[2];
                saveEmoticons();
                this.sendReply('|raw|The emoticon "' + Tools.escapeHTML(parts[1]) + '" has been added: <img src="' + parts[2] + '">');
                break;

            case 'delete':
            case 'remove':
            case 'rem':
            case 'del':
                if (!parts[1]) return this.sendReply("Usage: /emoticon del, [name]");
                if (!emoticons[parts[1]]) return this.sendReply("The emoticon \"" + parts[1] + "\" does not exist.");
                delete emoticons[parts[1]];
                saveEmoticons();
                this.sendReply("The emoticon \"" + parts[1] + "\" has been removed.");
                break;

            case 'on':
            case 'enable':
            case 'disable':
            case 'off':
            	if (!this.can('roommod', null, room)) return this.sendReply('Access denied.');
                var status = ((parts[0] === 'enable' || parts[0] === 'on') ? true : false);
                if (room.disableEmoticons === status) return this.sendReply("Emoticons are already " + (status ? "enabled" : "disabled") + " in this room.");
                room.disableEmoticons = status;
                room.chatRoomData.disableEmoticons = status;
                Rooms.global.writeChatRoomData();
                this.privateModCommand('(' + user.name + ' ' + (status ? ' enabled ' : ' disabled ') + 'emoticons in this room.)');
                break;

            case 'view':
            case 'list':
                if (!this.canBroadcast()) return;
                var reply = "<b><u>Emoticons (" + Object.size(emoticons) + ")</u></b><br />";
                for (var emote in emoticons) reply += "(" + emote + " <img src=\"" + emoticons[emote] + "\">) ";
                this.sendReplyBox(reply);
                break;

            default:
            case 'help':
                if (!this.canBroadcast()) return;
                this.sendReplyBox(
                    "Emoticon Commands:<br />" +
                    "<small>/emoticon may be substituted with /emoticons, /emotes, or /emote</small><br />" +
                    "/emoticon add, [name], [url] - Adds an emoticon.<br />" +
                    "/emoticon del/delete/remove/rem, [name] - Removes an emoticon.<br />" +
                    "/emoticon enable/on/disable/off - Enables or disables emoticons in the current room.<br />" +
                    "/emoticon view/list - Displays the list of emoticons.<br />" +
                    "/emoticon help - Displays this help command.<br />" +
                    "<a href=\"https://gist.github.com/jd4564/ef66ecc47c58b3bb06ec\">Emoticon Plugin by: jd</a>"
                );
                break;
        }
    }
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};

var colorCache = {};
function hashColor (name) {
    name = toId(name);
    if (colorCache[name]) return colorCache[name];

    var hash = MD5(name);
    var H = parseInt(hash.substr(4, 4), 16) % 360;
    var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
    var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

    var rgb = hslToRgb(H, S, L);
    colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
    return colorCache[name];
}

function hslToRgb(h, s, l) {
    var r, g, b, m, c, x;

    if (!isFinite(h)) h = 0;
    if (!isFinite(s)) s = 0;
    if (!isFinite(l)) l = 0;

    h /= 60;
    if (h < 0) h = 6 - (-h % 6);
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs((2 * l) - 1)) * s;
    x = c * (1 - Math.abs((h % 2) - 1));

    if (h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    m = l - c / 2;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
        r: r,
        g: g,
        b: b
    };
}

function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B);
}

function toHex(N) {
    if (N === null) return "00";
    N = parseInt(N);
    if (N === 0 || isNaN(N)) return "00";
    N = Math.max(0, N);
    N = Math.min(N, 255);
    N = Math.round(N);
    return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}
