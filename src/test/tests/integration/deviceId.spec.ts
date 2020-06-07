"use strict";

import DeviceId from "../../../js/background/DeviceId";
import Logger from "../../../js/Logger";

describe('DeviceId Tests', () => {

    afterEach(async function () {
        let deviceId = new DeviceId();
        await deviceId.delete();
    });

    beforeEach(async function () {
        let deviceId = new DeviceId();
        await deviceId.delete();
    });

    it('DeviceId Basic', async function () {
        let deviceId = new DeviceId();
        await deviceId.delete();
        let uuid1: { [id: string]: any };
        let uuid2: { [id: string]: any };
        let uuid3: { [id: string]: any };
        // New UUID is generated
        uuid1 = await deviceId.loadOrGenerate();
        uuid2 = await deviceId.loadOrGenerate();
        await deviceId.delete();
        uuid3 = await deviceId.loadOrGenerate();
        expect(uuid1).toBeDefined();
        expect(uuid2).toBeDefined();
        expect(uuid3).toBeDefined();

        expect(uuid1["deviceId"]).toBeDefined();

        expect(uuid1).not.toBeNull();
        expect(uuid2).not.toBeNull();
        expect(uuid3).not.toBeNull();

        expect(uuid1["deviceId"]).not.toBeNull();

        expect(uuid1).toEqual(uuid2);
        expect(uuid1).not.toEqual(uuid3);

        Logger.log(JSON.stringify(uuid1));

    });

});
