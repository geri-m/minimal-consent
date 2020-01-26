"use strict";

const dateFormat = require('dateformat'); // from library

export default class Utils {
    static log(message) {
        console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }
}