var config = require('config');
var Beanworker = require('fivebeans').worker;
var beanConfig = config.get('beanstalkd');
var options =
{
    id: 'exRate_Worker',
    host: beanConfig.host,
    port: beanConfig.port,
    handlers:
    {
        exrate: require('./exratehandler')()
    },
    ignoreDefault: true
};
var worker = new Beanworker(options);
worker.start([beanConfig.tube]);
console.log("worker started");