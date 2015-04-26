"use strict";
var Q = require('q'), mongo_service = require('./mongo_service'), ex_fetcher = require('./ex_fetcher'), config = require('config'), worker_config = config
		.get('worker'), max_success = worker_config.max_success, max_error = worker_config.max_error, success_interval = worker_config.success_interval, error_interval = worker_config.error_interval;

module.exports = function() {
	function ExRateHandler() {
		this.type = 'exrate';
	}

	ExRateHandler.prototype.work = function(payload, callback) {
		console.log('pick up job: %j', payload);
		var from = payload.from;
		var to = payload.to;

		var ft_fetch = Q.denodeify(ex_fetcher.fetch);
		var mg_saveExRate = Q.denodeify(mongo_service.saveExRate);
		var mg_onSuccess = Q.denodeify(mongo_service.onSuccess);
		var mg_onError = Q.denodeify(mongo_service.onError);

		function handleMongoError(err) {
			console.error('fatal mongo error: %j', err);
			callback('bury');
		}

		function stopJob() {
			mongo_service.removeJob(from, to, function(err) {
				if (err) {
					handleMongoError(err);
				} else {
					console.log('job removed');
					callback('success');
					console.log('worker stopped');
				}
			});
		}

		console.log('fetching exchange rate');
		ft_fetch(from, to).then(function(rate) {
			mg_saveExRate(from, to, rate).then(function() {
				mg_onSuccess(from, to).then(function(count) {
					console.log('success count: %d', count);
					if (count >= max_success) {
						stopJob();
					} else {
						callback("release", success_interval);
					}
				}, handleMongoError);
			}, handleMongoError);
		}, function(err) {
			console.error(err);
			mg_onError(from, to).then(function(count) {
				console.log('error count: %d', count);
				if (count >= max_error) {
					stopJob();
				} else {
					callback("release", error_interval);
				}
			}, handleMongoError);
		});
	};

	var handler = new ExRateHandler();
	return handler;
};