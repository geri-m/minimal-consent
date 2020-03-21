"use strict";

import Utils from "../Utils";
import HistoryEntry from "../entities/HistoryEntry";

const historyKeyOfStorage = "history";

export default class History {

    constructor() {
    }

    public load(): Promise<HistoryEntry[]> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result: { [id: string]: any }) {
                Utils.log("load: Data in Storage: " + JSON.stringify(result));

                let resultArray = new Array<HistoryEntry>();

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                    for (let i = 0; i < result.history.length; i++) {

                        let entry = HistoryEntry.class(result.history[i]);

                        Utils.log("Entry: " + JSON.stringify(entry));
                        resultArray.push(entry);
                        if (chrome.runtime.lastError) {
                            Utils.log(chrome.runtime.lastError.message);
                        }
                    }
                }
                // if we are good, resolve (equal to an return, but async)
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(resultArray);
            });
        })
    }

    // https://www.freecodecamp.org/news/javascript-from-callbacks-to-async-await-1cc090ddad99/
    public async save(historyItemToStore: HistoryEntry): Promise<void> {
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("save: Data loaded");
        // check if there is an entry with this URL
        if (resultArray.filter((historyItem: HistoryEntry) => historyItem.url.includes(historyItemToStore.url)).length <= 0) {
            // Adding the new Row;
            resultArray.push(historyItemToStore);
            Utils.log("History Item Stored for Host: " + historyItemToStore.url);

            // sort array by date.
            resultArray.sort(function (a: HistoryEntry, b: HistoryEntry) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds();
            });

            let history: { [id: string]: HistoryEntry[]; } = {
                history: resultArray
            };

            Utils.log("Data to be save to storage (stored): " + JSON.stringify(history));

            return new Promise(function (resolve, reject) {
                chrome.storage.sync.set(history, function () {
                    Utils.log('Saved new history object to Chrome Storage.' + JSON.stringify(history));
                    // store worked, resolve now.
                    chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
                });
            });
        } else {
            Utils.log("There was already an Entry for: " + historyItemToStore.url + ". No need to update Data in Storage.");
        }
    }

    public async getLastFound(host: string) {
        Utils.log("getLastFound for: " + host);
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("Data loaded: " + JSON.stringify(resultArray) + ", Len: " + resultArray.length);
        for (let i = 0; i < resultArray.length; i++) {
            Utils.log("Counter: " + i + ", URL: " + resultArray[i].url.includes(host));
            if (resultArray[i].url.includes(host)) {
                Utils.log(JSON.stringify(resultArray[i]));
                return resultArray[i];
            }
        }
        return null;
    }

    async getAmountOfUrlsBlocked() {
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("Data loaded");
        return resultArray.filter((historyItem: HistoryEntry) => historyItem.implemented === true).length;
    }

    public clearStorage(): Promise<void> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.remove(historyKeyOfStorage, function () {
                Utils.log('Storage Cleared');
                // store worked, resolve now.
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
            });
        });
    }

    public doMigration(): Promise<any> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result) {
                Utils.log("doMigration: Data in Storage: " + JSON.stringify(result));

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                    let modification = false;
                    for (let i = 0; i < result.history.length; i++) {
                        // Okay, there is Ping Result in this Record.
                        if (typeof result.history[i] !== 'undefined' && result.history[i] !== null) {
                            Utils.log("Migration of Record: #" + i + ": " + JSON.stringify(result.history[i]));
                            let he = {};
                            try {
                                // parsing as JSON.
                                he = HistoryEntry.class(result.history[i]);
                                // okay, we have at lest one Element with the old Syntax:
                                if (typeof he !== 'undefined' && he !== null) {
                                    // put the Update back into the storage.
                                    result.history[i] = he;
                                    Utils.log("Record: " + i + " was updated, :" + JSON.stringify(result.history[i]));
                                    modification = true;
                                } else {
                                    Utils.log("Parsing of 'old' JSON Structure failed");
                                }
                            } catch (e) {
                                Utils.log("error parsing History Object from storage. (likely, we already did this)")
                            }

                        } // there is no Ping Result
                    } // fort

                    // save back.
                    if (modification) {
                        Utils.log("Now saving again");
                        // sort array by date.
                        result.history.sort(function (a: HistoryEntry, b: HistoryEntry) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds();
                        });
                        Utils.log("New history sorted");

                        chrome.storage.sync.set(result, function () {
                            Utils.log('Saved new history object to Chrome Storage.');
                            // store worked, resolve now.
                            chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result);
                        });

                    } else {
                        Utils.log("There was no modification, so there was no problem");
                    }
                }
                // if we are good, resolve (equal to an return, but async)
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result);
            });
        })
    }
}
