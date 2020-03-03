"use strict";

import History from "../../../js/background/History";
import HistoryEntry from "../../../js/entities/HistoryEntry";
import Utils from "../../../js/Utils";
import PingResult from "../../../js/entities/PingResult";

describe('History', () => {

    beforeAll(async function () {
    });

    afterAll(async function () {
    });

    beforeEach(async function () {
        let hist = new History();
        await hist.clearStorage();
    });

    it('Empty History', async function () {
        let hist = new History();
        let found = await hist.getLastFound("www.orf.at");
        expect(Object.entries(found).length).toBe(0);

        let blockCount = await hist.getAmountOfUrlsBlocked();
        expect(blockCount).toBe(0);
    });

    it('Add one records and do lastFound', async function () {
        let hist = new History();
        let pr = new PingResult(false, true, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let he = new HistoryEntry("2020-02-20 10:00:00", "https://www.orf.at/", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);

        await hist.save(he);

        let found = await hist.getLastFound("www.orf.at");
        expect(Object.entries(found).length).toBe(6);

        found = await hist.getLastFound("www.heise.at");
        expect(Object.entries(found).length).toBe(0);

        let blockCount = await hist.getAmountOfUrlsBlocked();
        expect(blockCount).toBe(1);
    });


    it('Test Migration of History', async function () {
        let hist = new History();

        let result = {};
        result.history = [];

        let entry1 = {}; //= HistoryEntry.classFromJson(JSON.parse('{"cmp":"request.cmp","cmpScriptUrl":"request.cmpScripUrl","date":"2020-03-01 17:37:45","implemented":false,"pingResult":{"_cmpId":413},"url":"www.orf.at"}'));
        entry1.cmp = "Some CMP";
        entry1.cmpScriptUrl = "request.cmpScripUrl";
        entry1.date = "2020-03-01 17:37:45";
        entry1.implemented = false;
        entry1.pingResult = {};
        entry1.pingResult.cmpId = 412;
        entry1.url = "www.orf.at";

        let entry2 = {}; // = HistoryEntry.classFromJson(JSON.parse('{"cmp":"TrustArc Inc","cmpScriptUrl":"//consent.truste.com/notice?domain=forbes.com&c=teconsent","date":"2020-03-01 17:37:57","implemented":true,"pingResult":{"_cmpId":41},"url":"www.forbes.com"}'));
        entry2.cmp = "TrustArc Inc";
        entry2.cmpScriptUrl = "//consent.truste.com/notice?domain=forbes.com&c=teconsent";
        entry2.date = "2020-03-01 17:37:57";
        entry2.implemented = true;
        entry2.pingResult = {};
        entry2.pingResult.cmpId = 41;
        entry2.url = "www.forbes.com";

        let entry3 = {}; // = HistoryEntry.classFromJson(JSON.parse('{"cmp":"Usercentrics GmbH","cmpScriptUrl":"https://app.usercentrics.eu/latest/main.js","date":"2020-03-01 17:37:45","implemented":true,"pingResult":{"_cmpId":5,"_cmpLoaded":false,"_gdprAppliesGlobally":false},"url":"usercentrics.com"}'));
        entry3.cmp = "Usercentrics GmbH";
        entry3.cmpScriptUrl = "https://app.usercentrics.eu/latest/main.js";
        entry3.date = "2020-03-01 17:37:45";
        entry3.implemented = true;
        entry3.pingResult = {};
        entry3.pingResult.cmpId = 5;
        entry3.pingResult.cmpLoaded = false;
        entry3.pingResult.gdprAppliesGlobally = false;
        entry3.url = "www.usercentrics.com";

        result.history.push(entry1);
        result.history.push(entry2);
        result.history.push(entry3);

        await storeObject(result);

        await hist.doMigration();

        let forbes = await hist.getLastFound("www.forbes.com");
        console.log("Forbes");
        console.log(forbes);
        let forbesObject = HistoryEntry.classFromDisk(forbes);
        expect(forbesObject.pingResult.cmpId).toBe(41);

        let uc = await hist.getLastFound("www.usercentrics.com");
        console.log("UC");
        console.log(uc);
        let ucObject = HistoryEntry.classFromDisk(uc);
        expect(ucObject.pingResult.cmpId).toBe(5);

    });
});


async function storeObject(store) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.set(store, function () {
            Utils.log('Saved new history object to Chrome Storage.');
            // store worked, resolve now.
            resolve();
        });
    });
}



