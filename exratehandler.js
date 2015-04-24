var Q = require('q'),
mongoservice = require('./mongoservice'),
exfetcher = require('./exfetcher'),
config = require('config'),
workerConfig = config.get('worker'),
maxSuccess = workerConfig.maxSuccess,
maxError = workerConfig.maxError,
successInterval = workerConfig.successInterval,
errorInterval = workerConfig.errorInterval;

module.exports = function()
{
    function ExRateHandler()
    {
        this.type = 'exrate';
    }

    ExRateHandler.prototype.work = function(payload, callback)
    {
    	console.log(payload);
    	var from = payload.from;
    	var to = payload.to;
    	
    	var ex_fetch = Q.denodeify(exfetcher.fetch);
    	var mg_saveExRate = Q.denodeify(mongoservice.saveExRate);
    	var mg_onSuccess = Q.denodeify(mongoservice.onSuccess);
    	var mg_onError = Q.denodeify(mongoservice.onError);
    	
    	function handleError(err) {
    		console.error(err);
    		callback('bury');
    	}
    	ex_fetch(from, to)
    	.then(function (rate){
    		mg_saveExRate(from, to, rate)
    		.then(function(){
    			mg_onSuccess(from, to)
    			.then(function(count) {
    	    		console.log('success count: ' + count);
        			if (count >= maxSuccess) {
            			callback('success');   		
        			} else {
            			callback("release", successInterval);
        			}                			
        		});
    		}, handleError);    		
    	}, function(err){
    		mg_onError(from, to)
    		.then(function(count) {
	    		console.log('error count: ' + count);    			
    			if (count >= maxError) {
        			callback('success');   		
    			} else {
        			callback("release", errorInterval);        				
    			}
    		}, handleError);
    	});
    };
    
    var handler = new ExRateHandler();
    return handler;
};