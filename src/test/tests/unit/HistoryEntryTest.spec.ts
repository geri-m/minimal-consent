"use strict";

import HistoryEntry from "../../../js/entities/HistoryEntry";
import PingResult from "../../../js/entities/PingResult";

describe('History Tests', () => {


    // url, cmp, cmpScriptUrl, pingResult, implemented

    it('Properly Full Example', async function () {
        let pr = new PingResult(false, true, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let he = new HistoryEntry("2020-02-20 10:00:00", "https://www.heise.de/", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", pr, true);
        expect(JSON.parse(JSON.stringify(he))).toEqual(JSON.parse('{"date":"2020-02-20 10:00:00","url":"https://www.heise.de/","cmp":"UserCentrics","cmpScriptUrl":"https://www.usercentrics.com/js/latest/bundle.js","pingResult":{"gdprAppliesGlobally":false,"gdprApplies":true,"cmpLoaded":false,"cmpStatus":"cmpStatus","displayStatus":"displayStatus","apiVersion":"apiVersion","cmpVersion":1,"cmpId":2,"gvlVersion":3,"tcfPolicyVersion":4},"implemented":true}'));
        expect(he.date).toEqual("2020-02-20 10:00:00");
        expect(he.url).toEqual("https://www.heise.de/");
        expect(he.cmp).toEqual("UserCentrics");
        expect(he.cmpScriptUrl).toEqual("https://www.usercentrics.com/js/latest/bundle.js");
        expect(he.pingResult).toEqual(pr);
        expect(he.implemented).toBeTrue();
        expect(Object.entries(he).length).toEqual(6);

        let he2 = HistoryEntry.classFromJson(he);
        expect(he2.date).toEqual("2020-02-20 10:00:00");
        expect(he2.url).toEqual("https://www.heise.de/");
        expect(he2.cmp).toEqual("UserCentrics");
        expect(he2.cmpScriptUrl).toEqual("https://www.usercentrics.com/js/latest/bundle.js");
        expect(he2.pingResult).toEqual(pr);
        expect(he2.implemented).toBeTrue();
        expect(Object.entries(he2).length).toEqual(6);
    });

    it('Missing Parameter', async function () {
        expect(function () {
            let he = new HistoryEntry("2020-02-20 10:00:00", "https://www.heise.de/", "UserCentrics", "https://www.usercentrics.com/js/latest/bundle.js", undefined, undefined);
        }).toThrow(new Error("Ping Result in History Entry must not be null"));
    });

});