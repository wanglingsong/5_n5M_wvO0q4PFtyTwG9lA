function saveExRate(fromCurrency, toCurrency, rate, callback) {
	// TODO
	console.log('saving ex rate: ' + rate);
	callback(null);
}

function onSuccess(fromCurrency, toCurrency, callback) {
	// TODO
	callback(null,10);
}

function onError(fromCurrency, toCurrency, callback) {
	// TODO
	callback(null, 2);
}

exports.saveExRate = saveExRate;
exports.onSuccess = onSuccess;
exports.onError = onError;