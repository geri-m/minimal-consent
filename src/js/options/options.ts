"use strict";

import HistoryEntry from "../entities/HistoryEntry"
import Utils from "../Utils";
import ConstMessaging from "../ConstMessaging"

export default class Options {

    private readonly _clearHistory: Element;
    private readonly _closeWindow: Element;

    constructor(document: Document) {
        this._clearHistory = document.getElementById('clear-history');
        this._closeWindow = document.getElementById('close-window');
    }

    public static get pageName(): string {
        return ConstMessaging._optionsFromPage;
    }

    public static get cmdGetHistory(): string {
        return ConstMessaging._optionsCmdGetHistory;
    }

    public static get cmdClearHistory(): string {
        return ConstMessaging._optionsCmdClearHistory;
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
        let urlText = document.createTextNode(historyEntry.url);
        url.appendChild(urlText);

        let date = document.createElement('td');
        let dateText = document.createTextNode(historyEntry.date);
        date.appendChild(dateText);

        let cmp = document.createElement('td');
        let cmpText = document.createTextNode(historyEntry.cmp);
        cmp.appendChild(cmpText);


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
