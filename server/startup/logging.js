const winston = require('winston');
require('express-async-errors');

module.exports = function () {

    //winston.add(new winston.transport.Console({colorize:true,prettyPrint:true,level:'error'}));


    //if (process.env.NODE_ENV !== 'production') {
        winston.add(new winston.transports.Console({
            format: winston.format.colorize(),
            prettyPrint: true
        }));
    //}

    // const logger = winston.createLogger({
    //     transports: [
    //         //
    //         // - Write all logs with importance level of `error` or less to `error.log`
    //         // - Write all logs with importance level of `info` or less to `combined.log`
    //         //
    //         new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //         new winston.transports.Console({ colorize: true, prettyPrint: true, level: 'error' }),
    //     ],
    // });



    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    process.on('unhandledRejection', (ex) => {
       console.log('unhandledRejection:'+ex);
    });
   

};