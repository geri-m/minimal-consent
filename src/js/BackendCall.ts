"use strict";

import Logger from "./Logger";
import PingResult from "./entities/PingResult";
import CmpType from "./cmp/CmpType";
import ConstMessaging from "./ConstMessaging";

export default class BackendCall {


    // This is Data we are going to send
    private _cmp: string;
    private _cmpId: number;
    private _type: CmpType;
    private _cmpScriptUrl: string;
    private _implemented: boolean;
    // This is required for the logic within the class
    private _isSuccessfulBlock: boolean;
    private _isPingResultReceived: boolean;
    private _dataReceived: boolean;
    private _timeoutForBackendCall: any;

    constructor() {
        this._cmp = "na";
        this._cmpScriptUrl = "na";
        this._pingResult = {};
        this._implemented = false;

        // this is for the states.
        this._isSuccessfulBlock = false;
        this._isPingResultReceived = false;
        this._dataReceived = false;
    }

    public static get pageName(): string {
        return ConstMessaging._backendCallFromPage;
    }

    private _pingResult: any;

    /**
     * Setter for the Ping Result, if we find a CMP on the Page
     *
     * @param pingResult
     */

    set pingResult(pingResult: PingResult) {
        Logger.log("Pingback in BackendCall set: " + pingResult);
        this._pingResult = PingResult.class(pingResult);
        this._isPingResultReceived = true;

        // if the CMP was already clicked, do the backend call
        // we only do this call, if the CMP is _NOT_ implemented. If we the CMP is implemented, we wait for aresponse
        // from the JavaScript Detector.

        if (this._dataReceived) {
            if (this._implemented && this._isSuccessfulBlock) {
                Logger.log("We have an implemented for CMP and succesful Block happend. Sent Backend call");
                // check if there is a timeout and cancel if necessary.
                clearTimeout(this._timeoutForBackendCall);
                // trigger the call right now.
                this.triggerCall();
            } else if (this._implemented && !this._isSuccessfulBlock) {
                Logger.log("We have an implementation, but not yet a successful block. We don't do anything. successfulBloc() will handle");
            } else if (!this._implemented && this._isSuccessfulBlock) {
                Logger.log("This CMP is not yet implemented (or not yet set)")
            } else {
                Logger.log("There is no implementation and no successful Bock")
            }
        } else {
            Logger.log("We don't have a CMP Implementation yet, but already PingBack Data. For Saftey Reasons, we schedule backendcall");
            this._timeoutForBackendCall = setTimeout(this.triggerCall.bind(this), 5000);
        }
    }

    public cmpData(cmpId: number, cmp: string, cmpScriptUrl: string, type: CmpType, implemented: boolean): void {
        Logger.log("Data set by CMP");
        this._cmpId = cmpId;
        this._cmp = cmp;
        this._cmpScriptUrl = cmpScriptUrl;
        this._type = type;
        this._implemented = implemented;
        this._dataReceived = true;
    }

    public successfulBlock(): void {
        Logger.log("succefulblock in BackendCall");
        this._isSuccessfulBlock = true;

        if (this._isPingResultReceived) {
            Logger.log("Ping is here, successful bock too. Trigger BackendCall");
            // check if there is a timeout and cancel if necessary.
            clearTimeout(this._timeoutForBackendCall);
            // we have everything, trigger backend call
            this.triggerCall();
        } else {
            // Sending to Background Script
            switch (this._type) {
                case CmpType.WAIT_FOR_ASYNC_CALLBACK:
                    // if we wait for the callback, the backend call is done in the 'setPingResult';
                    // we already have click away the CMP so, wait for the pingresult and go.
                    Logger.log("We are waiting for the Website to send the PingResult");
                    break;
                case CmpType.WAIT_FOR_TIME_FRAME:
                    Logger.log("We are waiting five seconds to trigger the backend call");
                    clearTimeout(this._timeoutForBackendCall);
                    this._timeoutForBackendCall = setTimeout(this.triggerCall.bind(this), 5000);
                    break;
                case CmpType.DO_NOT_WAIT:
                    Logger.log("We Trigger the Backend Call right now");
                    clearTimeout(this._timeoutForBackendCall);
                    this.triggerCall();
                    break;
                default:
                    throw new Error("Unknown CMP Type");
            } // switch
        }
    }

    /**
     * Actual Method to trigger the backend call. Can be triggered from various functions
     */

    private triggerCall(): void {
        Logger.log("Call now Triggered");

        // If the CMP-ID is not set in the Ping Result, put it there.
        if (typeof this._pingResult.cmpId === "undefined") {
            this._pingResult.cmpId = this._cmpId;
        }

        // we are sending separate components in 'sendMessage()' as in the BackendCall, we don't know the URL.
        // this class is part of the content-Script and has no access to the URL.

        if (typeof safari !== 'undefined') {
            Logger.log("+++ triggerCall on Safari +++");
            // @ts-ignore: 'dispatchMessage' currently is not part of any TypeScript Package so far.
            safari.extension.dispatchMessage('backend', {
                cmp: this._cmp,
                cmpScriptUrl: this._cmpScriptUrl,
                pingResult: this._pingResult,
                implemented: this._implemented,
                from: BackendCall.pageName
            });
        } else if (typeof chrome !== 'undefined') {
            Logger.log("+++ triggerCall on Chrome +++");
            chrome.runtime.sendMessage({
                cmp: this._cmp,
                cmpScripUrl: this._cmpScriptUrl,
                pingResult: this._pingResult,
                implemented: this._implemented,
                from: BackendCall.pageName
            });
        } else {
            Logger.log("+++ triggerCall on some other Platform +++")
        }
    }
}
