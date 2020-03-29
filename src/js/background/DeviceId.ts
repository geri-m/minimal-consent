"use strict";

import Utils from "../Utils";
import {v4 as uuid} from 'uuid';

const deviceIdKeyInStorage = "deviceId";

export default class DeviceId {

    constructor() {
    }

    /**
     * Method to either load an existing Device UUID from the Storage or generate one and store it there.
     */

    public loadOrGenerate(): Promise<string> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(deviceIdKeyInStorage, function (result: { [id: string]: any }) {
                // The JSON is simply empty if there is no UUID yet in the Storage.
                Utils.log("DeviceID in Storage: " + JSON.stringify(result));

                let uuidResult: string;

                // Case 1: Device ID exists in the storage.
                if (result.hasOwnProperty("deviceId")) {
                    // send the device ID back
                    uuidResult = result["deviceId"];
                }
                // Case 2: In this case we generate a random UUID and store it and send it back.
                else {
                    uuidResult = uuid();

                    Utils.log("UUID Generated: " + uuidResult);


                    let uuidToStore: { [id: string]: string; } = {
                        deviceId: uuidResult
                    };

                    chrome.storage.sync.set(uuidToStore, function () {
                        Utils.log('Saved UUID in Storage' + JSON.stringify(uuidToStore));
                        // store worked, resolve now.
                        chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
                    });
                }

                // if we are good, resolve (equal to an return, but async)
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(uuidResult);
            });
        });
    }

    public delete(): Promise<void> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.remove(deviceIdKeyInStorage, function () {
                Utils.log('Storage Cleared');
                // store worked, resolve now.
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
            });
        });
    }
}