"use strict";

import PingResult from "../../../js/entities/PingResult";

describe('PingResult Tests', () => {


    it('TCF 1.1 Example', async function () {
        let pr = new PingResult(false, undefined, false);
        expect(JSON.stringify(pr)).toEqual("{\"gdprAppliesGlobally\":false,\"cmpLoaded\":false}");
        let pr2 = PingResult.classFromJson(pr);
        expect(pr).toEqual(pr2);
        expect(Object.entries(pr2).length).toEqual(2);
    });

    it('Full Example', async function () {
        let pr = new PingResult(false, undefined, false, "cmpStatus", "displayStatus", "apiVersion", 1, 2, 3, 4);
        let pr2 = PingResult.classFromJson(pr);
        expect(pr).toEqual(pr2);

        expect(pr2.gdprAppliesGlobally).toBeFalse();
        expect(pr2.gdprApplies).toBeUndefined();
        expect(pr2.cmpLoaded).toBeFalse();
        expect(pr2.cmpStatus).toEqual("cmpStatus");
        expect(pr2.displayStatus).toEqual("displayStatus");
        expect(pr2.apiVersion).toEqual("apiVersion");
        expect(pr2.cmpVersion).toEqual(1);
        expect(pr2.cmpId).toEqual(2);
        expect(pr2.gvlVersion).toEqual(3);
        expect(pr2.tcfPolicyVersion).toEqual(4);
        expect(pr2.tcfVersion).toEqual("TCF 1.1");
        expect(Object.entries(pr2).length).toEqual(9);
    });

    it('Null Example', async function () {
        let pr = new PingResult();
        expect(JSON.stringify(pr)).toEqual("{}");
        let pr2 = PingResult.classFromJson(pr);
        expect(pr).toEqual(pr2);
        expect(Object.entries(pr2).length).toEqual(0);
    });


    it('From JSON', async function () {
        let json = '{"gdprApplies":true,"cmpLoaded":false,"cmpStatus":"cmpStatus","displayStatus":"displayStatus","apiVersion":"apiVersion","cmpVersion":1,"cmpId":2,"gvlVersion":3,"tcfPolicyVersion":4}';
        let pr2 = PingResult.classFromJson(JSON.parse(json));
        expect(pr2.gdprAppliesGlobally).toBeUndefined();
        expect(pr2.gdprApplies).toBeTrue();
        expect(pr2.cmpLoaded).toBeFalse();
        expect(pr2.cmpStatus).toEqual("cmpStatus");
        expect(pr2.displayStatus).toEqual("displayStatus");
        expect(pr2.apiVersion).toEqual("apiVersion");
        expect(pr2.cmpVersion).toEqual(1);
        expect(pr2.cmpId).toEqual(2);
        expect(pr2.gvlVersion).toEqual(3);
        expect(pr2.tcfPolicyVersion).toEqual(4);
        expect(pr2.tcfVersion).toEqual("TCF 2.0");
        expect(Object.entries(pr2).length).toEqual(9);
    });


    it('From Object', async function () {
        let json = {};
        json.gdprAppliesGlobally = true;
        json.gdprApplies = false;

        let pr2 = PingResult.classFromJson(json);
        expect(pr2.gdprAppliesGlobally).toBeTrue();
        expect(pr2.gdprApplies).toBeFalse();
        expect(pr2.cmpLoaded).toBeUndefined();
        expect(pr2.cmpStatus).toBeUndefined();
        expect(pr2.displayStatus).toBeUndefined();
        expect(pr2.apiVersion).toBeUndefined();
        expect(pr2.cmpVersion).toBeUndefined();
        expect(pr2.cmpId).toBeUndefined();
        expect(pr2.gvlVersion).toBeUndefined();
        expect(pr2.tcfPolicyVersion).toBeUndefined();
        expect(pr2.tcfVersion).toEqual("not defined");
        expect(Object.entries(pr2).length).toEqual(2);

    });
});

