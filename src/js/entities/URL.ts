"use strict";

export default class URL {

    private readonly _url: string;

    constructor(url: string) {
        if (URL.checkIfDefinedAndNotNull(url)) {
            this._url = url;
        } else {
            throw new Error("URL String in Url must not be null");
        }
    }

    public get url() {
        return this._url;
    }

    public get host() {
        let parser = document.createElement('a');
        parser.href = this._url;
        return parser.hostname;
    }

    public get isHttp() {
        return (this._url.includes("http://") || this._url.includes("https://"));
    }

    public static class(obj: URL) {
        return new URL(obj.url);
    }

    toJSON() {
        return {
            url: this._url
        }
    }

    private static checkIfDefinedAndNotNull(field: any) {
        return typeof field !== 'undefined' && field !== null;
    }
}

