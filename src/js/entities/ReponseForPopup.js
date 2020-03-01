"use strict";

import URL from "./URL";

export default class ResponseForPopup {

    constructor(url, lastFound, count) {
        this._url = new URL(url);
        this._lastFound = lastFound;
        this._count = count;
    }

    get url() {
        return this._url;
    }

    get lastFound() {
        return this._lastFound;
    }

    get count() {
        return this._count;
    }

    static class(obj) {
        return new ResponseForPopup(obj._url._url, obj._lastFound, obj._count);
    }

}

