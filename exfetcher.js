var request = require('request'),
cheerio = require("cheerio");


function fetch(from, to, callback) {
	var url = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From='+from+'&To=' + to;
	request(url, function(err, resp, body){
		$ = cheerio.load(body);
		var rawRate = $('.uccRes .rightCol').text().replace(to,'').trim();
		var rate = Math.round(parseFloat(rawRate) * 100) / 100;
		callback(err, rate);			    	
	});
}

exports.fetch = fetch;
