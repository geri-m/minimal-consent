"use strict";

import Utils from "../Utils";
import HistoryEntry from "../entities/HistoryEntry";

const historyKeyOfStorage = "history";

export default class History {

    constructor() {
    }

    load() {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result) {
                Utils.log("Data in Storage: " + JSON.stringify(result));

                let resultArray = [];

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                    for (let i = 0; i < result.history.length; i++) {
                        resultArray.push(HistoryEntry.classFromDisk(result.history[i]));
                    }
                }
                // if we are good, resolve (equal to an return, but async)
                resolve(resultArray);
            });
        })
    }

    // https://www.freecodecamp.org/news/javascript-from-callbacks-to-async-await-1cc090ddad99/
    async save(historyItemToStore) {
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("Data loaded");

        // check if there is an entry with this URL
        if (resultArray.filter((historyItem) => historyItem.url.includes(historyItemToStore.url)).length <= 0) {
            // Adding the new Row;
            resultArray.push(historyItemToStore);
            Utils.log("History Item Stored for Host: " + historyItemToStore.url);

            // sort array by date.
            resultArray.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
            });
            Utils.log("New history sorted");

            let history = {};
            history.history = resultArray;

            return new Promise(function (resolve, reject) {
                chrome.storage.sync.set(history, function () {
                    Utils.log('Saved new history object to Chrome Storage.');
                    // store worked, resolve now.
                    resolve();
                });
            });
        } else {
            Utils.log("There was already an Entry for: " + historyItemToStore.url + ". No need to update Data in Storage.");
        }
    }

    async getLastFound(host) {
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("Data loaded");
        let result = {};
        for (let i = 0; i < resultArray.length; i++) {
            Utils.log("Counter: " + i + ", URL: " + resultArray[i].url.includes(host));
            if (resultArray[i].url.includes(host)) {
                Utils.log(JSON.stringify(resultArray[i]));
                result = resultArray[i];
            }
        }

        Utils.log("Count: " + Object.entries(result).length);
        return result;
    }

    async getAmountOfUrlsBlocked() {
        // get the data from the storage
        let resultArray = await this.load();
        Utils.log("Data loaded");
        return resultArray.filter((historyItem) => historyItem.implemented === true).length;
    }

    clearStorage() {
        let history = {};
        history.history = {};
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(history, function () {
                Utils.log('Storage Cleared');
                // store worked, resolve now.
                resolve();
            });
        });
    }

    doMigration() {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result) {
                Utils.log("Data in Storage: " + JSON.stringify(result));

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                    let modification = false;
                    for (let i = 0; i < result.history.length; i++) {
                        // Okay, there is Ping Result in this Record.
                        if (typeof result.history[i] !== 'undefined' && result.history[i] !== null) {
                            Utils.log("Migration of Record: #" + i + ": " + JSON.stringify(result.history[i]));
                            let he = HistoryEntry.classFromJson(result.history[i]);
                            // okay, we have at lest one Element with the old Syntax:
                            if (Object.entries(he).length > 0) {
                                // put the Update back into the storage.
                                result.history[i] = he;
                                Utils.log("Record: " + i + " was updated, :" + JSON.stringify(result.history[i]));
                                modification = true;
                            } // else if (Ping Result is okay)
                        } // there is no Ping Result
                    } // fort

                    // save back.
                    if (modification) {
                        Utils.log("No saving again");
                        // sort array by date.
                        result.history.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return new Date(b.date) - new Date(a.date);
                        });
                        Utils.log("New history sorted");

                        chrome.storage.sync.set(result, function () {
                            Utils.log('Saved new history object to Chrome Storage.');
                            // store worked, resolve now.
                            resolve(result);
                        });

                    } else {
                        Utils.log("There was no modification, so there was no problem");
                    }
                }
                // if we are good, resolve (equal to an return, but async)
                resolve(result);
            });
        })
    }
}
