"use strict";
var config = require('config'), mongoose = require('mongoose'), mongo_config = config
		.get('mongodb');

mongoose.connect('mongodb://' + mongo_config.username + ':' + 
		mongo_config.password + '@' + mongo_config.host + ':' + 
		mongo_config.port + '/' + mongo_config.database);

var Schema = mongoose.Schema;

var exRateSchema = new Schema({
	from : String,
	to : String,
	rate : String,
	created_at : Date
});

var ExRate = mongoose.model('ExRate', exRateSchema);

var jobSchema = new Schema({
	from : String,
	to : String,
	success : Number,
	error : Number
});

var Job = mongoose.model('Job', jobSchema);

function saveExRate(from_currency, to_currency, rate, callback) {
	var newExRate = new ExRate({
		from : from_currency,
		to : to_currency,
		rate : rate,
		created_at : new Date()
	});
	newExRate.save(function(err) {
		console.log('saving ex rate: %d', rate);
		callback(err);
	});
}

function onSuccess(from_currency, to_currency, callback) {
	// reset error count upon success
	Job.findOneAndUpdate({
		from : from_currency,
		to : to_currency
	}, {
		$inc : {
			success : 1
		},
		error : 0
	}, {
		upsert : true,
		'new' : true
	}, function(err, job) {
		if (err) {
			callback(err);
		} else {
			callback(err, job.success);
		}
	});
}

function onError(from_currency, to_currency, callback) {
	Job.findOneAndUpdate({
		from : from_currency,
		to : to_currency
	}, {
		$inc : {
			error : 1
		}
	}, {
		upsert : true,
		'new' : true
	}, function(err, job) {
		if (err) {
			callback(err);
		} else {
			callback(err, job.error);
		}
	});
}

function removeJob(from_currency, to_currency, callback) {
	console.log('removing job %s->%s ', from_currency, to_currency);
	Job.remove({
		from : from_currency,
		to : to_currency
	}, function(err) {
		callback(err);
	});
}

exports.saveExRate = saveExRate;
exports.onSuccess = onSuccess;
exports.onError = onError;
exports.removeJob = removeJob;