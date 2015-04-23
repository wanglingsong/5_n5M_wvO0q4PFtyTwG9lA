function saveExRate(rate, callback) {
	console.log('saving ex rate: ' + rate);
	callback(null);
}

function onSuccess(fromCurrency, toCurrency, callback) {
	// TODO
	callback(10);
}

function onError(fromCurrency, toCurrency, callback) {
	// TODO
	callback(3);
}

exports.saveExRate = saveExRate;
exports.onSuccess = onSuccess;
exports.onError = onError;