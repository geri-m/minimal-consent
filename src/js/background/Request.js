"use strict";

import Utils from "../Utils";

const url = 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent';
const httpMethod = "POST";

export default class Request {

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    send(requestJson) {
        this.xhr.open(httpMethod, url, true);
        //Send the proper header information along with the requestthi
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(requestJson));
        Utils.log("Backendcall done:" + JSON.stringify(requestJson));
    }

}