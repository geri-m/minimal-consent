"use strict";

const dateFormat = require("dateformat");

export default class Logger {

    public static log(message: string): void {
        console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }
}