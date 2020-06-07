"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

export default class Borlabs implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Borlabs.net";

    // this is not an IAB Solution
    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(10001, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    /*
    https://www.123effizientdabei.de/, https://www.abibuch-designer.de/, https://www.staubsauger-berater.de/ https://www.arge.de/
     */

    public handleCmp(): void {
        // Step 1
        const popup = "div._brlbs-box-wrap";
        let popupDiv = this._cmp.queryNodeSelector(popup);

        const checkboxIndictor = "div._brlbs-checkbox-indicator";
        let checkboxIndictorDiv = this._cmp.queryNodeSelectorAll(checkboxIndictor);
        Logger.log("checkboxIndictorDiv: " + checkboxIndictorDiv.length);

        const media = "input#checkbox-external-media";
        let inputMedia = this._cmp.queryNodeSelector(media);

        const stats = "input#checkbox-statistics";
        let inputStats = this._cmp.queryNodeSelector(stats);

        const marketing = "input#checkbox-marketing";
        let inputMarketing = this._cmp.queryNodeSelector(marketing);


        const save = "a._brlbs-btn";
        let saveButtons = this._cmp.queryNodeSelectorAll(save);
        Logger.log("saveButtons: " + saveButtons.length);


        Logger.log("State: " + this._cmp.state);

        if (Utils.objectClickable(popupDiv) && this._cmp.state === 0) {
            Logger.log("Div Found");

            if (Utils.objectClickable(inputMedia)) {
                Logger.log("Clicked inputMedia");
                inputMedia.setAttribute("checked", "false");
            }

            if (Utils.objectClickable(inputStats)) {
                Logger.log("Clicked inputStatst");
                inputStats.setAttribute("checked", "false");
            }


            if (Utils.objectClickable(inputMarketing)) {
                Logger.log("Clicked inputMarketing");
                inputMarketing.setAttribute("checked", "false");
            }


            let clicked: boolean = false;

            if (saveButtons && saveButtons.length > 0) {
                saveButtons.forEach(function (span: any) {
                    Logger.log(span.innerHTML);
                    if (span.innerHTML.includes("essenzielle")) {
                        span.click();
                        Logger.log("Clicked on essenzielle");
                        clicked = true;
                    } else if (span.innerHTML.includes("Speichern")) {
                        span.click();
                        Logger.log("Clicked on Speichern");
                        clicked = true;
                    }

                });
            }

            if (clicked) {
                Logger.log("Clicked, reset now");
                this._cmp.reset();
            }
        }
    }
}
