"use strict";

import Utils from "../Utils";

export default class Request {

    private static readonly URL = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent";
    private static readonly HTTP_METHOD = "POST";

    private readonly xhr: XMLHttpRequest;

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    public send(requestJson: any): void {
        this.xhr.open(Request.HTTP_METHOD, Request.URL, true);
        //Send the proper header information along with the requestthi
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(requestJson));
        Utils.log("Backendcall done:" + JSON.stringify(requestJson));
    }

}