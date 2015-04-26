"use strict";
var request = require('request'), cheerio = require("cheerio");

function fetch(from, to, callback) {
	var url = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From='	+ 
	from + '&To=' + to;
	request(url,
			function(err, resp, body) {
				if (err) {
					callback(err);
				} else {
					var $ = cheerio.load(body);
					var raw_rate = $('.uccRes .rightCol').text()
							.replace(to, '').trim();
					var rate = Math.round(parseFloat(raw_rate) * 100) / 100;
					if (isNaN(rate)) {
						callback('invalid exchange rate', rate);
					} else {
						callback(null, rate);
					}
				}
			});
}

exports.fetch = fetch;
