"use strict";

export default class PingResult {

    constructor(gdprAppliesGlobally, gdprApplies, cmpLoaded, cmpStatus, displayStatus, apiVersion, cmpVersion, cmpId, gvlVersion, tcfPolicyVersion) {
        if (this.checkIfDefinedAndNotNull(gdprAppliesGlobally)) {
            this._gdprAppliesGlobally = Boolean(gdprAppliesGlobally);
        }

        if (this.checkIfDefinedAndNotNull(gdprApplies)) {
            this._gdprApplies = Boolean(gdprApplies);
        }

        if (this.checkIfDefinedAndNotNull(cmpLoaded)) {
            this._cmpLoaded = Boolean(cmpLoaded);
        }

        if (this.checkIfDefinedAndNotNull(cmpStatus)) {
            this._cmpStatus = String(cmpStatus);
        }

        if (this.checkIfDefinedAndNotNull(displayStatus)) {
            this._displayStatus = String(displayStatus);
        }

        if (this.checkIfDefinedAndNotNull(apiVersion)) {
            this._apiVersion = String(apiVersion);
        }

        if (this.checkIfDefinedAndNotNull(cmpVersion)) {
            this._cmpVersion = Number(cmpVersion);
        }

        if (this.checkIfDefinedAndNotNull(cmpId)) {
            this._cmpId = Number(cmpId);
        }

        if (this.checkIfDefinedAndNotNull(gvlVersion)) {
            this._gvlVersion = Number(gvlVersion);
        }

        if (this.checkIfDefinedAndNotNull(tcfPolicyVersion)) {
            this._tcfPolicyVersion = Number(tcfPolicyVersion);
        }
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

    static classFromJson(pingResult) {
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

    static classFromDisk(pingResult) {
        return new PingResult(pingResult._gdprAppliesGlobally,
            pingResult._gdprApplies,
            pingResult._cmpLoaded,
            pingResult._cmpStatus,
            pingResult._displayStatus,
            pingResult._apiVersion,
            pingResult._cmpVersion,
            pingResult._cmpId,
            pingResult._gvlVersion,
            pingResult._tcfPolicyVersion);
    }


    toJSON() {
        let result = {};

        if (this.checkIfDefinedAndNotNull(this._gdprAppliesGlobally)) {
            result.gdprAppliesGlobally = this._gdprAppliesGlobally;
        }

        if (this.checkIfDefinedAndNotNull(this._gdprApplies)) {
            result.gdprApplies = this._gdprApplies;
        }

        if (this.checkIfDefinedAndNotNull(this._cmpLoaded)) {
            result.cmpLoaded = this._cmpLoaded;
        }

        if (this.checkIfDefinedAndNotNull(this._cmpStatus)) {
            result.cmpStatus = this._cmpStatus;
        }

        if (this.checkIfDefinedAndNotNull(this._displayStatus)) {
            result.displayStatus = this._displayStatus;
        }

        if (this.checkIfDefinedAndNotNull(this._apiVersion)) {
            result.apiVersion = this._apiVersion;
        }

        if (this.checkIfDefinedAndNotNull(this._cmpVersion)) {
            result.cmpVersion = this._cmpVersion;
        }

        if (this.checkIfDefinedAndNotNull(this._cmpId)) {
            result.cmpId = this._cmpId;
        }


        if (this.checkIfDefinedAndNotNull(this._gvlVersion)) {
            result.gvlVersion = this._gvlVersion;
        }

        if (this.checkIfDefinedAndNotNull(this._tcfPolicyVersion)) {
            result.tcfPolicyVersion = this._tcfPolicyVersion;
        }

        return result;
    }

    checkIfDefinedAndNotNull(field) {
        return typeof field !== 'undefined' && field !== null;
    }


    get tcfVersion() {
        let tcfVersion = "";
        if (typeof this.gdprAppliesGlobally !== 'undefined' && typeof this.cmpLoaded !== 'undefined') {
            tcfVersion = "TCP 1.1";
        } else if (typeof this.gdprApplies !== 'undefined' && typeof this.cmpLoaded !== 'undefined') {
            tcfVersion = "TCP 2.0";
        } else {
            tcfVersion = "not defined";
        }

        return tcfVersion;
    }
}

