"use strict";

import Utils from "../Utils";

export default class Request {

    private static readonly URL_CONSENT = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent";
    private static readonly URL_STATUS = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/status";
    private static readonly URL_USER_REQUEST = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/userRequest";

    private static readonly HTTP_METHOD = "POST";

    private readonly xhr: XMLHttpRequest;

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    public send(requestJson: { [id: string]: any }, uuid: string, version: string): void {
        // adding Version to Request. As the parameters was an object, it looks like we can not modify it .. wired.
        let temp = JSON.parse(JSON.stringify(requestJson));
        temp.version = version;
        temp.uuid = uuid;
        this.xhr.open(Request.HTTP_METHOD, Request.URL_CONSENT, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(temp));
        Utils.log("Backend call done:" + JSON.stringify(temp));
    }

    public onInstall(reason: string, uuid: string, version: string): void {
        // Sanity Check, so we only send correct data to the backend.
        let statusToSend: { [id: string]: string; } = {
            uuid: uuid,
            status: reason,
            version: version
        };

        Utils.log("Install Data: " + JSON.stringify(statusToSend));
        this.xhr.open(Request.HTTP_METHOD, Request.URL_STATUS, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(statusToSend));
        Utils.log("onInstall Info Sent for UUID" + JSON.stringify(statusToSend));
    }

    public urlRequestToImplement(url: string, uuid: string, version: string): void {
        this.xhr.open(Request.HTTP_METHOD, Request.URL_USER_REQUEST, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.

        let urlToSend: { [id: string]: string; } = {
            uuid: uuid,
            url: url,
            version: version
        };
        Utils.log("Send to backend: " + JSON.stringify(urlToSend));
        this.xhr.send(JSON.stringify(urlToSend));
        Utils.log("URL to revisit requested by User: " + JSON.stringify(urlToSend));
    }


}