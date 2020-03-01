"use strict";

import URL from "./URL";
import HistoryEntry from "./HistoryEntry";

export default class ResponseForPopup {

    constructor(url, lastFound, count) {
        if (this.checkIfDefinedAndNotNull(url)) {
            this._url = URL.class(url);
        } else {
            throw new Error("URL String in ResponseForPopup must not be null");
        }

        if (this.checkIfDefinedAndNotNull(lastFound) && Object.entries(lastFound).length > 0) {
            this._lastFound = HistoryEntry.class(lastFound);
        } else {
            this._lastFound = {};
        }

        if (this.checkIfDefinedAndNotNull(count)) {
            this._count = Number(count);
        } else {
            this._count = 0;
        }
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
            if (Object.entries(this._lastFound).length > 0) {
                if (this._lastFound.cmp !== "na") {
                    // found, known, implemented - case 1
                    if (this._lastFound.isImplemented) {
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
        return new ResponseForPopup(obj.url.url, obj.lastFound, obj.count);
    }

    toJSON() {
        return {
            url: this._url,
            lastFound: this._lastFound,
            count: this._count
        }
    }

    checkIfDefinedAndNotNull(field) {
        return typeof field !== 'undefined' && field !== null;
    }

}

