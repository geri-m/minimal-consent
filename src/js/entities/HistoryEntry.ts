"use strict";

import PingResult from "./PingResult";
import Utils from "../Utils";

export default class HistoryEntry {

    public static readonly CMP_UNKNOWN = "unknown";

    // Parameters are only set once, hence they can be readonly.
    private readonly _date: string;
    private readonly _url: string;
    private readonly _cmp: string;
    private readonly _cmpScriptUrl: string;
    private readonly _pingResult: PingResult;
    private readonly _implemented: boolean;

    constructor(date: string, url: string, cmp: string, cmpScriptUrl: string, pingResult: PingResult, implemented: boolean) {
        if (Utils.checkIfDefinedAndNotNull(date)) {
            this._date = date;
        } else {
            throw new Error("Date in History Entry must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(url)) {
            this._url = url;
        } else {
            throw new Error("URL in History Entry must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(cmp)) {
            this._cmp = cmp;
        } else {
            throw new Error("CMP in History Entry must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(cmpScriptUrl)) {
            this._cmpScriptUrl = cmpScriptUrl;
        } else {
            throw new Error("CMP Script in History Entry must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(pingResult)) {
            this._pingResult = PingResult.classFromJson(pingResult);
        } else {
            throw new Error("Ping Result in History Entry must not be null");
        }

        if (Utils.checkIfDefinedAndNotNull(implemented)) {
            this._implemented = implemented;
        } else {
            throw new Error("Implemented in History Entry must not be null");
        }
    }

    public get date(): string {
        return this._date;
    }

    public get url(): string {
        return this._url;
    }

    public get cmp(): string {
        if (this._cmp === "na") {
            return HistoryEntry.CMP_UNKNOWN;
        } else {
            return this._cmp;
        }
    }

    public get cmpScriptUrl(): string {
        return this._cmpScriptUrl;
    }

    public get pingResult(): PingResult {
        return this._pingResult;
    }

    public get implemented(): boolean {
        return this._implemented;
    }

    public static classFromJson(historyEntry: HistoryEntry): HistoryEntry {
        return new HistoryEntry(historyEntry.date,
            historyEntry.url,
            historyEntry.cmp,
            historyEntry.cmpScriptUrl,
            historyEntry.pingResult,
            historyEntry.implemented);
    }

    public static classFromDisk(historyEntry: any): HistoryEntry {
        return new HistoryEntry(historyEntry._date,
            historyEntry._url,
            historyEntry._cmp,
            historyEntry._cmpScriptUrl,
            PingResult.classFromDisk(historyEntry._pingResult),
            historyEntry._implemented);
    }

    public toJSON(): any {
        return {
            date: this._date,
            url: this._url,
            cmp: this._cmp,
            cmpScriptUrl: this._cmpScriptUrl,
            pingResult: this._pingResult,
            implemented: this._implemented
        };
    }

}

