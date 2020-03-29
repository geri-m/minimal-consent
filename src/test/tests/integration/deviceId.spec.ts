"use strict";

import DeviceId from "../../../js/background/DeviceId";
import Utils from "../../../js/Utils";

describe('DeviceId Tests', () => {

    it('DeviceId Basic', async function () {
        let deviceId = new DeviceId();
        await deviceId.delete();
        let uuid1: string;
        let uuid2: string;
        let uuid3: string;
        // New UUID is generated
        uuid1 = await deviceId.loadOrGenerate();
        Utils.log("Result: " + uuid1);
        uuid2 = await deviceId.loadOrGenerate();
        await deviceId.delete();
        uuid3 = await deviceId.loadOrGenerate();
        expect(uuid1).toBeDefined();
        expect(uuid2).toBeDefined();
        expect(uuid3).toBeDefined();

        expect(uuid1).not.toBeNull();
        expect(uuid2).not.toBeNull();
        expect(uuid3).not.toBeNull();

        expect(uuid1).toBe(uuid2);
        expect(uuid1).not.toBe(uuid3);
    });

});
