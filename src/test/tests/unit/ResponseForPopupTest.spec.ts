"use strict";

import HistoryEntry from "../../../js/entities/HistoryEntry";
import PingResult from "../../../js/entities/PingResult";
import ResponseForPopup from "../../../js/entities/ResponseForPopup";
import URL from "../../../js/entities/URL";

describe('ResponseForPopup Tests', () => {


    // url, cmp, cmpScriptUrl, pingResult, implemented

    it('Properly Full Example (Case 1)', async function () {
        let pr = new PingResult(false, true, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let he = new HistoryEntry("2020-02-20 10:00:00", "https://www.heise.de/", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);
        let url = new URL("http://www.heise.de");
        let rfp = new ResponseForPopup(url, he, 10);
        expect(rfp.count).toEqual(10);
        expect(rfp.url).toEqual(url);
        expect(rfp.lastFound).toEqual(he);
        expect(rfp.case).toEqual(1);
    });

    it('Properly Full Example (Case 2)', async function () {
        let pr = new PingResult(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        let he = new HistoryEntry("2020-02-21 10:00:00", "https://www.anothersite.de/", "CookieBot", "https://www.usercentrics.com/js/latest/bundle.js", pr, false);
        let url = new URL("http://www.anothersite.de");
        let rfp = new ResponseForPopup(url, he, 10);
        expect(rfp.count).toEqual(10);
        expect(rfp.url).toEqual(url);
        expect(rfp.lastFound).toEqual(he);
        expect(rfp.case).toEqual(2);
    });

    it('Properly Full Example (Case 3)', async function () {
        let pr = new PingResult(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        let he = new HistoryEntry("2020-02-22 10:00:00", "https://www.somesite.de/", "na", "na", pr, false);
        let url = new URL("http://www.somesite.de");
        let rfp = new ResponseForPopup(url, he, 10);
        expect(rfp.count).toEqual(10);
        expect(rfp.url).toEqual(url);
        expect(rfp.lastFound.cmp).toEqual(HistoryEntry.CMP_UNKNOWN);
        expect(rfp.case).toEqual(3);
    });

    it('Properly Full Example (Case 4)', async function () {
        let url = new URL("http://www.somesite.de");
        let rfp = new ResponseForPopup(url, undefined, 10);
        expect(rfp.count).toEqual(10);
        expect(rfp.url).toEqual(url);
        expect(rfp.lastFound).toBeNull();
        expect(rfp.case).toEqual(4);
    });

    it('Properly Full Example (Case 5)', async function () {
        let url = new URL("chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/");
        let rfp = new ResponseForPopup(url, undefined, 10);
        expect(rfp.count).toEqual(10);
        expect(rfp.url).toEqual(url);
        expect(rfp.lastFound).toBeNull();
        expect(rfp.case).toEqual(5);
    });

    it('Missing Parameter', async function () {
        expect(function () {
            new ResponseForPopup(undefined, undefined, undefined);
        }).toThrow(new Error("URL String in ResponseForPopup must not be null"));
    });

    it('Wrong Parameter', async function () {
        let rfp = new ResponseForPopup(new URL("www.orf.at"), undefined, undefined);
        expect(rfp.lastFound).toBeNull();
    });

    it('Undefined Parameter', async function () {
        let rfp = new ResponseForPopup(new URL("www.orf.at"), undefined, undefined);
        expect(rfp.lastFound).toBeNull();
    });

    it('Null Parameter', async function () {
        let rfp = new ResponseForPopup(new URL("www.orf.at"), null, null);
        expect(rfp.lastFound).toBeNull();
    });

});
