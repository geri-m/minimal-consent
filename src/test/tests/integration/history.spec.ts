"use strict";

import History from "../../../js/background/History";
import HistoryEntry from "../../../js/entities/HistoryEntry";
import Utils from "../../../js/Utils";
import PingResult from "../../../js/entities/PingResult";

describe('History', () => {

    afterEach(async function () {
        let hist = new History();
        await hist.clearStorage();
    });

    beforeEach(async function () {
        let hist = new History();
        await hist.clearStorage();
    });

    it('Empty History', async function () {
        let hist = new History();
        let found = await hist.getLastFound("www.someurl.at");
        expect(found).toBeNull();

        let blockCount = await hist.getAmountOfUrlsBlocked();
        expect(blockCount).toBe(0);
    });

    it('Add one records and do lastFound', async function () {
        let hist = new History();
        let pr = new PingResult(false, true, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let he = new HistoryEntry("2020-02-20 10:00:00", "www.orf.at", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);

        await hist.save(he);

        let found = await hist.getLastFound("www.orf.at");
        expect(found).not.toBeNull();

        found = await hist.getLastFound("www.heise.at");
        expect(found).toBeNull();

        let entries = await hist.load();
        console.log("add one Entires: " + entries.length);

        let blockCount = await hist.getAmountOfUrlsBlocked();
        console.log("add one: " + JSON.stringify(hist));
        console.log("blockCount1: " + blockCount);
        expect(blockCount).toBe(1);
    });


/*
    it("Simple History Tests", async function () {

        let result : any;
        chrome.storage.sync.set({"entry": {"key": "value"}}, function () {
            console.log('Saved new history object to Chrome Storage.' + chrome.runtime.lastError.message);
        });

        chrome.storage.sync.get("entry", function (r: { [id: string]: any }) {
            console.log("load: Data in Storage: " + JSON.stringify(result) + " " + chrome.runtime.lastError.message);
            result = r;
        });

        console.log("Result: " + result);

        expect(result).toBe(JSON.parse('{"key": "value"}'));
    });
*/

    it('Multiple History Entries in one Storage', async function () {
        let hist = new History();
        let pr = new PingResult(false, true, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let he1 = new HistoryEntry("2020-02-20 10:00:00", "www.orf.at", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);
        await hist.save(he1);

        let he2 = new HistoryEntry("2020-02-20 10:00:00", "www.forbes.com", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, false);
        await hist.save(he2);

        let he3 = new HistoryEntry("2020-02-20 10:00:00", "www.heise.de", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);
        await hist.save(he3);

        let found = await hist.getLastFound("www.orf.at");
        expect(found).not.toBeNull();

        found = await hist.getLastFound("www.heise.de");
        expect(found).not.toBeNull();

        found = await hist.getLastFound("www.forbes.de");
        expect(found).toBeNull();

        let entries = await hist.load();
        console.log("Multiple Entires: " + entries.length);

        let blockCount = await hist.getAmountOfUrlsBlocked();
        console.log("Multiple: " + JSON.stringify(hist));
        console.log("blockCount2: " + blockCount);
        expect(blockCount).toBe(2);
    });

    it('Test Migration of History', async function () {
        let hist = new History();

        // create an empty array for the History Key.
        let result: { [id: string]: any[]; } = {
            history: new Array<any>()
        };

        let cmp1: { [id: string]: any; } = {
            cmpId: 412
        };

        let entry1: { [id: string]: any; } = {
            cmp: "Some CMP",
            cmpScriptUrl: "request.cmpScripUrl",
            date: "2020-03-01 17:37:45",
            implemented: false,
            pingResult: cmp1,
            url: "www.orf.at"
        };

        let cmp2: { [id: string]: any; } = {
            cmpId: 41
        };

        let entry2: { [id: string]: any; } = {
            cmp: "TrustArc Inc",
            cmpScriptUrl: "//consent.truste.com/notice?domain=forbes.com&c=teconsent",
            date: "2020-03-01 17:37:57",
            implemented: true,
            pingResult: cmp2,
            url: "www.forbes.com"
        };

        let cmp3: { [id: string]: any; } = {
            cmpId: 5,
            cmpLoaded: false,
            gdprAppliesGlobally: false
        };

        let entry3: { [id: string]: any; } = {
            cmp: "Usercentrics GmbH",
            cmpScriptUrl: "https://app.usercentrics.eu/latest/main.js",
            date: "2020-03-01 17:37:45",
            implemented: true,
            pingResult: cmp3,
            url: "www.usercentrics.com"
        };

        result.history.push(entry1);
        result.history.push(entry2);
        result.history.push(entry3);

        // we use a separated store function, as 'save()' in the history object, used load() which creates an
        // array of HistoryEntries.
        await storeObject(result);
        await hist.doMigration();

        let forbes = await hist.getLastFound("www.forbes.com");
        expect(forbes).not.toBeNull();
        console.log("Forbes: " + forbes);
        let forbesObject = HistoryEntry.class(forbes);
        expect(forbesObject.pingResult.cmpId).toBe(41);

        let uc = await hist.getLastFound("www.usercentrics.com");
        expect(uc).not.toBeNull();
        console.log("UC: " + uc);
        let ucObject = HistoryEntry.class(uc);
        expect(ucObject.pingResult.cmpId).toBe(5);

    });


});


async function storeObject(store: any) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.set(store, function () {
            Utils.log('Saved new history object to Chrome Storage.');
            // store worked, resolve now.
            resolve();
        });
    });
}



