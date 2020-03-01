"use strict";

export default class PingResult {

    constructor(gdprAppliesGlobally, gdprApplies, cmpLoaded, cmpStatus, displayStatus, apiVersion, cmpVersion, cmpId, gvlVersion, tcfPolicyVersion) {
        this._gdprAppliesGlobally = Boolean(gdprAppliesGlobally);
        this._gdprApplies = Boolean(gdprApplies);
        this._cmpLoaded = Boolean(cmpLoaded);

        if (typeof cmpStatus !== 'undefined') {
            this._cmpStatus = String(cmpStatus);
        } else {
            this._cmpStatus = null
        }

        if (typeof displayStatus !== 'undefined') {
            this._displayStatus = String(displayStatus);
        } else {
            this._displayStatus = null
        }

        if (typeof apiVersion !== 'undefined') {
            this._apiVersion = String(apiVersion);
        } else {
            this._apiVersion = null
        }

        this._cmpVersion = Number(cmpVersion);
        this._cmpId = Number(cmpId);
        this._gvlVersion = Number(gvlVersion);
        this._tcfPolicyVersion = Number(tcfPolicyVersion);
    }

    get gdprAppliesGlobally() {
        return this._gdprAppliesGlobally;
    }

    get gdprApplies() {
        return this._gdprApplies;
    }

    get cmpLoaded() {
        return this._cmpLoaded;
    }

    get cmpStatus() {
        return this._cmpStatus;
    }

    get displayStatus() {
        return this._displayStatus;
    }

    get apiVersion() {
        return this._apiVersion;
    }

    get cmpVersion() {
        return this._cmpVersion;
    }

    get cmpId() {
        return this._cmpId;
    }

    get gvlVersion() {
        return this._gvlVersion;
    }

    get tcfPolicyVersion() {
        return this._tcfPolicyVersion;
    }

    static class(pingResult) {
        return new PingResult(pingResult.gdprAppliesGlobally,
            pingResult.gdprApplies,
            pingResult.cmpLoaded,
            pingResult.cmpStatus,
            pingResult.displayStatus,
            pingResult.apiVersion,
            pingResult.cmpVersion,
            pingResult.cmpId,
            pingResult.gvlVersion,
            pingResult.tcfPolicyVersion);
    }

    toJSON() {
        return {
            gdprAppliesGlobally: this._gdprAppliesGlobally,
            gdprApplies: this._gdprApplies,
            cmpLoaded: this._cmpLoaded,
            cmpStatus: this._cmpStatus,
            displayStatus: this._displayStatus,
            apiVersion: this._apiVersion,
            cmpVersion: this._cmpVersion,
            cmpId: this._cmpId,
            gvlVersion: this._gvlVersion,
            tcfPolicyVersion: this._tcfPolicyVersion
        };
    }
}

