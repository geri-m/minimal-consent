"use strict";

import History from "../../../js/background/History";

describe('Storage', () => {

    beforeAll(/*TestManager.initIntegrationBeforeAll()*/async function () {
    });

    afterAll(/*TestManager.initIntegrationAfterAll()*/async function () {
    });

    beforeEach(async function () {
    });

    describe('History Object,', () => {
        it('Add a backup', async function () {
            let hist = new History();
            await hist.clearStorage();

            let requestJson = {};
            requestJson.date = 'yyyy-mm-dd HH:MM:ss';
            requestJson.url = "www.orf.at";
            requestJson.cmp = "request.cmp";
            requestJson.cmpScriptUrl = "request.cmpScripUrl";
            requestJson.pingResult = "request.pingResult";
            requestJson.implemented = "request.implemented";

            await hist.save(requestJson);

            let found = await hist.getLastFound("www.orf.at");
            expect(Object.entries(found).length).toBe(6);

            found = await hist.getLastFound("www.heise.at");
            expect(Object.entries(found).length).toBe(0);
        });
    });

    describe('Pass', () => {
        it('Add a backup', async function () {
            expect("1").toBe("1");
        });
    });
});