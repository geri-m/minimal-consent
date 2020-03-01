"use strict";

export default class URL {

    constructor(url) {
        let link = String(url);
        let parser = document.createElement('a');
        parser.href = link;
        this._host = parser.hostname;
        this._isHttp = (link.includes("http://") || link.includes("https://"));
        this._url = link;
    }

    get url() {
        return this._url;
    }

    get host() {
        return this._host;
    }

    get isHttp() {
        return this._isHttp;
    }

    static class(obj) {
        return new URL(obj._url);
    }
}

