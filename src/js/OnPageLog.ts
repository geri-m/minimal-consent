"use strict";

const dateFormat = require("dateformat");

export default class OnPageLog {

    private readonly _console: Console;

    constructor(console: Console) {
        this._console = console;
    }

    public log(message: string): void {
        this._console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }
}

