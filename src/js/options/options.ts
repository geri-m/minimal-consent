"use strict";

import OnPageLog from "../OnPageLog";
import HistoryEntry from "../entities/HistoryEntry"
import Utils from "../Utils";

window.addEventListener('load', onLoad);

function onLoad() {
    let options: Options;
    options = new Options(document);
    options.init();
}

class Options {

    private readonly _clearHistory: Element;
    private readonly _closeWindow: Element;
    private readonly _log: OnPageLog;

    constructor(document: Document) {
        this._clearHistory = document.getElementById('clear-history');
        this._closeWindow = document.getElementById('close-window');
    }

    get log() {
        return this._log;
    }

    public init(): void {
        Utils.log("init");
        let _self = this;
        this._clearHistory.addEventListener('click', function () {
            _self.clearHistory(_self);
        });
        this._closeWindow.addEventListener('click', function () {
            window.close();
        });
        chrome.runtime.sendMessage({
            from: "optionsScript",
            cmd: "getHistory"
        }, function (response) {
            _self.handleResponse(response)
        });
    }

    private handleResponse(response: any): void {
        Utils.log("Response: " + JSON.stringify(response) + ", Len: " + response.length);
        if (typeof response !== "undefined" && response.length) {

            // sort array by date.
            response.sort(function (a: HistoryEntry, b: HistoryEntry) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds();
            });

            let _self = this;
            response.forEach(function (item: HistoryEntry, index: number) {
                _self.createRow(item, _self)
            });
        }
    }

    private clearHistory(option: Options): void {
        chrome.runtime.sendMessage({
            from: "optionsScript",
            cmd: "clearHistory"
        }, function (response) {
            Utils.log("History cleared");
        });
        window.close();
    }

    private createRow(historyEntry: HistoryEntry, option: Options): void {
        Utils.log("Item: " + JSON.stringify(historyEntry));

        let item: HistoryEntry;
        if (historyEntry.url) {
            Utils.log("Chrome");
            item = HistoryEntry.classFromJson(historyEntry);
        } else {
            Utils.log("Firefox");
            item = HistoryEntry.classFromDisk(historyEntry);
        }

        // let item = HistoryEntry.classFromJson(historyEntry);

        let url = document.createElement('td');
        url.innerHTML = item.url;

        let date = document.createElement('td');
        date.innerHTML = item.date;

        let cmp = document.createElement('td');
        cmp.innerHTML = item.cmp;

        let implemented = document.createElement('td');
        implemented.innerHTML = String(item.implemented);

        let tcf = document.createElement('td');
        tcf.innerHTML = item.pingResult.tcfVersion;

        let row = document.createElement('tr');
        row.appendChild(date);
        row.appendChild(url);
        row.appendChild(cmp);
        row.appendChild(tcf);
        row.appendChild(implemented);

        let table = document.getElementById("history");
        table.appendChild(row);
    }
}
