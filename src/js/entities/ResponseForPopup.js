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

    get case() {
        if (this._url.isHttp) {
            if (typeof this._lastFound !== 'undefined' && Object.entries(this._lastFound).length !== 0) {
                if (this._lastFound.cmp !== "na") {
                    // found, known, implemented - case 1
                    if (this._lastFound.implemented) {
                        return 1;
                    }
                    // found, known, but not implemented - case 2
                    else {
                        return 2;
                    }
                }
                // found, but knot known - Case 3
                else {
                    return 3;
                }
            }
            // not found - Case 4
            else {
                return 4;
            }
        }
        // no HTTP - Case 5
        else {
            return 5;
        }
    }


    static class(obj) {
        return new ResponseForPopup(obj._url._url, obj._lastFound, obj._count);
    }

}

