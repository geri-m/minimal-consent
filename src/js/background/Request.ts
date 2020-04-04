"use strict";

import Utils from "../Utils";
import URL from "../entities/URL";

export default class Request {

    private static readonly URL_CONSENT = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent";
    private static readonly URL_STATUS = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/status";
    private static readonly URL_USER_REQUEST = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/userRequest";

    private static readonly HTTP_METHOD = "POST";

    private readonly xhr: XMLHttpRequest;

    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    public send(requestJson: { [id: string]: any }): void {
        this.xhr.open(Request.HTTP_METHOD, Request.URL_CONSENT, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(requestJson));
        Utils.log("Backend call done:" + JSON.stringify(requestJson));
    }

    public install(uuid: { [id: string]: any }): void {
        // Sanity Check, so we only send correct data to the backend.
        uuid["status"] = "installed";
        this.statusUpdate(uuid);
    }

    public uninstall(uuid: { [id: string]: any }): void {
        // Sanity Check, so we only send correct data to the backend.
        uuid["status"] = "uninstall";
        this.statusUpdate(uuid);
    }

    public update(uuid: { [id: string]: any }): void {
        // Sanity Check, so we only send correct data to the backend.
        uuid["status"] = "update";
        this.statusUpdate(uuid);
    }


    public statusUpdate(uuid: { [id: string]: any }): void {
        this.xhr.open(Request.HTTP_METHOD, Request.URL_STATUS, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(uuid));
        Utils.log("Uninstall Info Sent for UUID" + JSON.stringify(uuid));
    }

    public urlRequestToImplement(url: URL): void {
        this.xhr.open(Request.HTTP_METHOD, Request.URL_USER_REQUEST, true);
        //Send the proper header information along with the request
        this.xhr.setRequestHeader("Content-Type", "application/json");
        // Sanity Check, so we only send correct data to the backend.
        this.xhr.send(JSON.stringify(url));
        Utils.log("URL to revisit requested by User: " + JSON.stringify(url));
    }


}