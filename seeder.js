var config = require('config');
var beanConfig = config.get('beanstalkd');
var fivebeans = require('fivebeans');
var client = new fivebeans.client(beanConfig.host, beanConfig.port);
client
    .on('connect', function()
    {
    	client.use(beanConfig.tube, function(err, tubename) {
        	client.put(0,0,60, JSON.stringify({type:'exrate', payload: {from:'HKD',to:'USD'}}), function(err, jobid) {
            	console.log(jobid);
        	});
    	});    	
    	console.log('connect');
    })
    .connect();