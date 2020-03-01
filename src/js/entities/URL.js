"use strict";

export default class URL {

    constructor(url) {
        this._url = String(url);
    }

    get url() {
        return this._url;
    }

    get host() {
        let parser = document.createElement('a');
        parser.href = this._url;
        return parser.hostname;
    }

    get isHttp() {
        return (this._url.includes("http://") || this._url.includes("https://"));
    }

    static class(obj) {
        return new URL(obj.url);
    }

    toJSON() {
        return {
            url: this._url
        }
    }
}

