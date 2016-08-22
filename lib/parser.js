module.exports = {
	reputation: function (reputation) {
		if (reputation == null) return reputation;
		reputation = parseInt(reputation);
		var rep = String(reputation);
		var neg = rep.charAt(0) === '-';
		rep = neg ? rep.substring(1) : rep;
		var str = rep;
		var leadingDigits = parseInt(str.substring(0, 4));
		var log = Math.log(leadingDigits) / Math.log(10);
		var n = str.length - 1;
		var out = n + (log - parseInt(log));
		if (isNaN(out)) out = 0;
		out = Math.max(out - 9, 0);
		out = (neg ? -1 : 1) * out;
		out = (out * 9) + 25;
		out = parseInt(out);
		return out;
	}
};