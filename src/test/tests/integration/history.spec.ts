"use strict";

import History from "../../../js/background/History";
import HistoryEntry from "../../../js/entities/HistoryEntry";
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

});
