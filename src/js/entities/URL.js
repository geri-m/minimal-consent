"use strict";

export default class URL {

    constructor(url) {
        if (this.checkIfDefinedAndNotNull(url)) {
            this._url = String(url);
        } else {
            throw new Error("URL String in Url must not be null");
        }
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

    checkIfDefinedAndNotNull(field) {
        return typeof field !== 'undefined' && field !== null;
    }
}

