var mongoservice = require('./mongoservice');
var config = require('config');
var workerConfig = config.get('worker');
var maxSuccess = workerConfig.maxSuccess;
var maxError = workerConfig.maxError;
var successInterval = workerConfig.successInterval;
var errorInterval = workerConfig.errorInterval;

function fetch(callback) {
	// TODO
	return callback(0.1);
}

module.exports = function()
{
    function ExRateHandler()
    {
        this.type = 'exrate';
    }

    ExRateHandler.prototype.work = function(payload, callback)
    {
    	console.log(payload);
    	var fromCurrency = payload.from;
    	var toCurrency = payload.to; 
    	// do fetching ex rate     	
    	fetch(function (rate){
        	// success
        	if (rate) {
        		mongoservice.saveExRate(rate, function(err){
        			if (!err) {
                		mongoservice.onSuccess(fromCurrency, toCurrency, function(count) {
                			if (count >= maxSuccess) {
                    			callback('success');   		
                			} else {
                    			callback("release", successInterval);
                			}                			
                		});		        				
        			} else {
        				console.error(err); // fatal error
            			callback('bury');		
        			}
        		});
        	} else {
        		mongoservice.onError(fromCurrency, toCurrency, function(count) {
        			if (count >= maxError) {
            			callback('success');   		
        			} else {
            			callback("release", errorInterval);        				
        			}
        		});  	        	
        	}
    	});
    };

    var handler = new ExRateHandler();
    return handler;
};