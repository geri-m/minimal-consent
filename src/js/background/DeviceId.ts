"use strict";

import Logger from "../Logger";
import {v4 as uuid} from 'uuid';

const deviceIdKeyInStorage = "deviceId";

export default class DeviceId {

    constructor() {

    }

    /**
     * Method to either load an existing Device UUID from the Storage or generate one and store it there.
     */

    public loadOrGenerate(): Promise<{ [id: string]: any }> {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(deviceIdKeyInStorage, function (result: { [id: string]: any }) {
                // The JSON is simply empty if there is no UUID yet in the Storage.
                Logger.log("DeviceID in Storage: " + JSON.stringify(result));

                let uuidToStore: any;

                // Case 1: Device ID exists in the storage.
                if (result.hasOwnProperty("deviceId")) {
                    const tempUuid = result["deviceId"];
                    // send the device ID back
                    uuidToStore = {
                        deviceId: tempUuid
                    };

                    Logger.log("UUID loaded: " + tempUuid);

                }
                // Case 2: In this case we generate a random UUID and store it and send it back.
                else {
                    const tempUuid = uuid();
                    // send the device ID back
                    uuidToStore = {
                        deviceId: tempUuid
                    };

                    Logger.log("UUID Generated: " + tempUuid);

                    chrome.storage.sync.set(uuidToStore, function () {
                        Logger.log('Saved UUID in Storage' + JSON.stringify(uuidToStore));
                        // store worked, resolve now.
                        chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
                    });
                }

                // if we are good, resolve (equal to an return, but async)
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(uuidToStore);
            });
        });
    }

    public delete(): Promise<void> {

        return new Promise(function (resolve, reject) {
            chrome.storage.sync.remove(deviceIdKeyInStorage, function () {
                Logger.log('Storage Cleared');
                // store worked, resolve now.
                chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
            });
        });
    }
}