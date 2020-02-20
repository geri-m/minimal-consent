"use strict";

import Utils from "../Utils";

const historyKeyOfStorage = "history";

export default class History {

    constructor() {
    }

    /*
        save(requestJson) {
            return new Promise(function(resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result) {
                Utils.log("Data in Storage: " + JSON.stringify(result));

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                } else {
                    // no history yet, create empty object.
                    result.history = [];
                }


                chrome.storage.sync.set(result, function () {
                    Utils.log('Saved new history object to Chrome Storage.');
                });
            });
        });
        }
    */
    load() {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(historyKeyOfStorage, function (result) {
                Utils.log("Data in Storage: " + JSON.stringify(result));

                if (result && result.history && result.history.length) {
                    // in this case there is already some history.
                } else {
                    // no history yet, create empty object.
                    result.history = [];
                }

                // if we are good, resolve (equal to an return, but async)
                resolve(result);
            });
        })
    }

    // https://www.freecodecamp.org/news/javascript-from-callbacks-to-async-await-1cc090ddad99/
    async save(objectToStore) {
        // get the data from the storage
        let history = await this.load();
        // Adding the new Row;
        history.history.push(objectToStore);

        Utils.log("Data loaded");

        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(history, function () {
                Utils.log('Saved new history object to Chrome Storage.');
                // store worked, resolve now.
                resolve();
            });
        });
    }

}