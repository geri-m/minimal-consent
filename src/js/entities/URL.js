"use strict";

export default class URL {

    constructor(link) {
        let parser = document.createElement('a');
        parser.href = String(link);
        this._host = parser.hostname;
        this._isHttp = (link.includes("http://") || link.includes("https://"));
    }

    get host() {
        return this._host;
    }

    get isHttp() {
        return this._isHttp;
    }
}

