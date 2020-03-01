"use strict";

import PingResult from "./PingResult";

export default class HistoryEntry {

    constructor(date, url, cmp, cmpScriptUrl, pingResult, implemented) {
        if (this.checkIfDefinedAndNotNull(date)) {
            this._date = String(date);
        } else {
            throw new Error("Date in History Entry must not be null");
        }

        if (this.checkIfDefinedAndNotNull(url)) {
            this._url = String(url);
        } else {
            throw new Error("URL in History Entry must not be null");
        }

        if (this.checkIfDefinedAndNotNull(cmp)) {
            this._cmp = String(cmp);
        } else {
            throw new Error("CMP in History Entry must not be null");
        }

        if (this.checkIfDefinedAndNotNull(cmpScriptUrl)) {
            this._cmpScriptUrl = String(cmpScriptUrl);
        } else {
            throw new Error("CMP Script in History Entry must not be null");
        }


        if (this.checkIfDefinedAndNotNull(pingResult)) {
            this._pingResult = PingResult.classFromJson(pingResult);
        } else {
            throw new Error("Ping Result in History Entry must not be null");
        }

        if (this.checkIfDefinedAndNotNull(implemented)) {
            this._implemented = Boolean(implemented);
        } else {
            throw new Error("Implemented in History Entry must not be null");
        }
    }

    get date() {
        return this._date;
    }

    get url() {
        return this._url;
    }

    get cmp() {
        return this._cmp;
    }

    get cmpScriptUrl() {
        return this._cmpScriptUrl;
    }

    get pingResult() {
        return this._pingResult;
    }

    get implemented() {
        return this._implemented;
    }

    static classFromJson(historyEntry) {
        return new HistoryEntry(historyEntry.date,
            historyEntry.url,
            historyEntry.cmp,
            historyEntry.cmpScriptUrl,
            historyEntry.pingResult,
            historyEntry.implemented);
    }

    static classFromDisk(historyEntry) {
        return new HistoryEntry(historyEntry._date,
            historyEntry._url,
            historyEntry._cmp,
            historyEntry._cmpScriptUrl,
            PingResult.classFromDisk(historyEntry._pingResult),
            historyEntry._implemented);
    }

    toJSON() {
        return {
            date: this._date,
            url: this._url,
            cmp: this._cmp,
            cmpScriptUrl: this._cmpScriptUrl,
            pingResult: this._pingResult,
            implemented: this._implemented
        };
    }

    checkIfDefinedAndNotNull(field) {
        return typeof field !== 'undefined' && field !== null;
    }

}

