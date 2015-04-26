var config = require('config'),
Beanworker = require('fivebeans').worker,
bean_config = config.get('beanstalkd'),
options =
{
    id: 'exRate_Worker',
    host: bean_config.host,
    port: bean_config.port,
    handlers:
    {
        exrate: require('./exrate_handler')()
    },
    ignoreDefault: true
},
worker = new Beanworker(options);
worker.start([bean_config.tube]);
console.log("worker started");