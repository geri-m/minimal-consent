"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

export default class DiDoMi implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Didomi.net";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(7, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    /*
    https://www.marianne.net/, https://www.lavoixdunord.fr/, https://www.tomsguide.fr/, https://www.generation-nt.com/
     */

    public handleCmp(): void {
        // Step 1
        const popup = "div.didomi-popup-container";
        let popupDiv = this._cmp.queryNodeSelector(popup);
        const details = "button#didomi-notice-learn-more-button";
        let detailsButton = this._cmp.queryNodeSelector(details);
        Logger.log("detailsButton: " + JSON.stringify(detailsButton));

        // Step1 2
        const refuser = "button.didomi-components-radio__option";
        let refuserButton = this._cmp.queryNodeSelectorAll(refuser);
        Logger.log("refuserButton length: " + refuserButton.length);


        const enregistrer = "button.didomi-components-button";
        let enregistrerButton = this._cmp.queryNodeSelectorAll(enregistrer);
        Logger.log("enregistrer length: " + enregistrer.length);


        Logger.log("State: " + this._cmp.state);

        if (Utils.objectClickable(detailsButton) && Utils.objectClickable(popupDiv) && this._cmp.state === 0) {
            Logger.log("Clicking on Details");
            detailsButton.click();
            this._cmp.state = 1;
        } else if (refuserButton.length > 0 && Utils.objectClickable(popupDiv) && this._cmp.state === 1) {
            Logger.log("Looking for Span1");
            let clicked: boolean = false;
            refuserButton.forEach(function (span: any) {
                Logger.log(span.innerHTML);
                if (span.innerHTML.toLowerCase().includes("refuser") || span.innerHTML.toLowerCase().includes("disagree")) {
                    span.click();
                    Logger.log("Clicked on Refuser/Disagree");
                    clicked = true;
                }
            });


            if (clicked) {
                Logger.log("Clicked, update set");
                this._cmp.state = 2;
            }
        } else if (enregistrerButton.length > 0 && Utils.objectClickable(popupDiv) && this._cmp.state === 2) {
            Logger.log("Looking for Save/Enregistre");
            let clicked: boolean = false;
            enregistrerButton.forEach(function (span: any) {
                Logger.log(span.innerHTML);
                if (span.innerHTML.toLowerCase().includes("enregistrer") || span.innerHTML.toLowerCase().includes("save")) {
                    span.click();
                    Logger.log("Clicked on Enregistrer/Save");
                    clicked = true;
                }
            });

            if (clicked) {
                Logger.log("Clicked, reset now");
                this._cmp.reset();
            }

        }
    }
}
