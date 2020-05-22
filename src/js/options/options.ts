"use strict";

import HistoryEntry from "../entities/HistoryEntry"
import Utils from "../Utils";

export default class Options {

    private static readonly _fromPage: string = "optionsScript";
    private static readonly _cmdGetHistory: string = "getHistory";
    private static readonly _cmdClearHistory: string = "clearHistory";
    private readonly _clearHistory: Element;
    private readonly _closeWindow: Element;

    constructor(document: Document) {
        this._clearHistory = document.getElementById('clear-history');
        this._closeWindow = document.getElementById('close-window');
    }

    public static get pageName(): string {
        return Options._fromPage;
    }

    public static get cmdGetHistory(): string {
        return Options._cmdGetHistory;
    }

    public static get cmdClearHistory(): string {
        return Options._cmdClearHistory;
    }

    public init(): void {
        Utils.log("init");
        let _self = this;
        if (Utils.checkIfDefinedAndNotNull(this._clearHistory)) {
            this._clearHistory.addEventListener('click', function () {
                _self.clearHistory();
            });
        }
        if (Utils.checkIfDefinedAndNotNull(this._closeWindow)) {
            this._closeWindow.addEventListener('click', function () {
                window.close();
            });
        }
        chrome.runtime.sendMessage({
            from: Options.pageName,
            cmd: Options.cmdGetHistory
        }, function (response) {
            _self.handleResponse(response)
        });
    }

    private handleResponse(response: HistoryEntry[]): void {
        if (Utils.checkIfDefinedAndNotNull(response)) {
            Utils.log("Response: " + JSON.stringify(response) + ", Len: " + response.length);
            if (Utils.checkIfDefinedAndNotNull(response) && response.length) {

                // Create an Object we can work with.
                let history = new Array<HistoryEntry>();
                response.forEach(function (item: HistoryEntry) {
                    history.push(HistoryEntry.class(item));
                });

                // sort array by date.
                history.sort(function (a: HistoryEntry, b: HistoryEntry) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds();
                });

                let _self = this;
                history.forEach(function (item: HistoryEntry, index: number) {
                    _self.createRow(item)
                });
            } else if (response.length === 0) {
                Utils.log("Result from Storage is/was empty.");
            } else {
                throw Error("Unable to parse 'HistoryEntry[]' in options.ts");
            }
        } else {
            throw Error("'HistoryEntry[]' in options.ts is null");
        }
    }

    private clearHistory(): void {
        chrome.runtime.sendMessage({
            from: Options.pageName,
            cmd: Options.cmdClearHistory
        }, function (response) {
            Utils.log("History cleared");
        });
        window.close();
    }

    private createRow(historyEntry: HistoryEntry): void {
        Utils.log("Item: " + JSON.stringify(historyEntry));

        let url = document.createElement('td');
        url.innerHTML = historyEntry.url;

        let date = document.createElement('td');
        date.innerHTML = historyEntry.date;

        let cmp = document.createElement('td');
        cmp.innerHTML = historyEntry.cmp;

        /*
        let implemented = document.createElement('td');
        implemented.innerHTML = String(historyEntry.implemented);

        let tcf = document.createElement('td');
        tcf.innerHTML = historyEntry.pingResult.tcfVersion;
        */
        let row = document.createElement('tr');
        row.appendChild(date);
        row.appendChild(url);
        row.appendChild(cmp);
        // row.appendChild(tcf);
        // row.appendChild(implemented);

        let table = document.getElementById("history");
        table.appendChild(row);
    }
}

window.addEventListener('load', onLoad);

function onLoad() {
    let options: Options;
    options = new Options(document);
    options.init();
}
