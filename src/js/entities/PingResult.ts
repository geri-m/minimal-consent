"use strict";

import Utils from "../Utils";

export default class PingResult {

    private readonly _gdprAppliesGlobally: boolean;
    private readonly _gdprApplies: boolean;
    private readonly _cmpLoaded: boolean;
    private readonly _cmpStatus: string;
    private readonly _displayStatus: string;
    private readonly _apiVersion: string;
    private readonly _cmpVersion: number;
    private _cmpId: number;
    private readonly _gvlVersion: number;
    private readonly _tcfPolicyVersion: number;

    constructor(gdprAppliesGlobally: boolean, gdprApplies: boolean, cmpLoaded: boolean, cmpStatus: string, displayStatus: string, apiVersion: string, cmpVersion: number, cmpId: number, gvlVersion: number, tcfPolicyVersion: number) {
        if (Utils.checkIfDefinedAndNotNull(gdprAppliesGlobally)) {
            this._gdprAppliesGlobally = gdprAppliesGlobally;
        }

        if (Utils.checkIfDefinedAndNotNull(gdprApplies)) {
            this._gdprApplies = gdprApplies;
        }

        if (Utils.checkIfDefinedAndNotNull(cmpLoaded)) {
            this._cmpLoaded = cmpLoaded;
        }

        if (Utils.checkIfDefinedAndNotNull(cmpStatus)) {
            this._cmpStatus = cmpStatus;
        }

        if (Utils.checkIfDefinedAndNotNull(displayStatus)) {
            this._displayStatus = displayStatus;
        }

        if (Utils.checkIfDefinedAndNotNull(apiVersion)) {
            this._apiVersion = apiVersion;
        }

        if (Utils.checkIfDefinedAndNotNull(cmpVersion)) {
            this._cmpVersion = cmpVersion;
        }

        if (Utils.checkIfDefinedAndNotNull(cmpId)) {
            this._cmpId = cmpId;
        }

        if (Utils.checkIfDefinedAndNotNull(gvlVersion)) {
            this._gvlVersion = gvlVersion;
        }

        if (Utils.checkIfDefinedAndNotNull(tcfPolicyVersion)) {
            this._tcfPolicyVersion = tcfPolicyVersion;
        }
    }

    get cmpId(): number {
        return this._cmpId;
    }

    set cmpId(id: number) {
        this._cmpId = id;
    }

    get gdprAppliesGlobally(): boolean {
        return this._gdprAppliesGlobally;
    }

    get gdprApplies(): boolean {
        return this._gdprApplies;
    }

    get cmpLoaded(): boolean {
        return this._cmpLoaded;
    }

    get cmpStatus(): string {
        return this._cmpStatus;
    }

    get displayStatus(): string {
        return this._displayStatus;
    }

    get apiVersion(): string {
        return this._apiVersion;
    }

    get cmpVersion(): number {
        return this._cmpVersion;
    }

    get gvlVersion(): number {
        return this._gvlVersion;
    }

    get tcfPolicyVersion(): number {
        return this._tcfPolicyVersion;
    }

    get tcfVersion(): string {
        let tcfVersion: string;
        if (typeof this.gdprAppliesGlobally !== 'undefined' && typeof this.cmpLoaded !== 'undefined' && typeof this.gdprApplies === 'undefined') {
            tcfVersion = "TCF 1.1";
        } else if (typeof this.gdprApplies !== 'undefined' && typeof this.cmpLoaded !== 'undefined' && typeof this.gdprAppliesGlobally === 'undefined') {
            tcfVersion = "TCF 2.0";
        } else {
            tcfVersion = "not defined";
        }
        return tcfVersion;
    }

    static classFromJson(pingResult: PingResult): PingResult {
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

    static classFromDisk(pingResult: any): PingResult {
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

    toJSON(): any {
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

