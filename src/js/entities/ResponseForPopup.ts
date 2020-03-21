"use strict";

import URL from "./URL";
import HistoryEntry from "./HistoryEntry";
import Utils from "../Utils";

export default class ResponseForPopup {


    private readonly _url: URL;
    private readonly _lastFound: HistoryEntry;
    private readonly _count: number;

    constructor(url: URL, lastFound: HistoryEntry, count: number) {
        if (Utils.checkIfDefinedAndNotNull(url)) {
            this._url = URL.class(url);
        } else {
            throw new Error("URL String in ResponseForPopup must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(lastFound) && Object.entries(lastFound).length > 0) {
            this._lastFound = HistoryEntry.class(lastFound);
        } else {
            this._lastFound = null;
        }

        if (Utils.checkIfDefinedAndNotNull(count)) {
            this._count = count;
        } else {
            this._count = 0;
        }
    }

    public get url(): URL {
        return this._url;
    }

    public get lastFound(): HistoryEntry {
        return this._lastFound;
    }

    public get count(): number {
        return this._count;
    }

    public get case(): number {
        if (this.url.isHttp) {
            console.log(this._lastFound);
            if (this._lastFound !== null && Object.entries(this._lastFound).length > 0) {
                if (this._lastFound.cmp !== HistoryEntry.CMP_UNKNOWN) {
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

    public static class(obj: any): ResponseForPopup {
        if (obj._url) {
            return new ResponseForPopup(URL.class(obj._url), obj._lastFound, obj._count);
        } else {
            return new ResponseForPopup(URL.class(obj.url), obj.lastFound, obj.count);
        }
    }

    public toJSON(): any {
        return {
            url: this._url,
            lastFound: this._lastFound,
            count: this._count
        }
    }
}

