import Logger from 'js-logger';

var dateFormat = require('dateformat'); // from library

// Adding Date to Log-output
Logger.useDefaults({
    formatter: function (messages, context) {
        messages.unshift(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l'));
    }
});

Logger.info("Background Script is required to Connect to the Hot Reload Plugin! Don't Remove!");
