"use strict";

import Utils from "../Utils";

export default class URL {

    private readonly _url: string;

    constructor(url: string) {
        if (Utils.checkIfDefinedAndNotNull(url)) {
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
}

