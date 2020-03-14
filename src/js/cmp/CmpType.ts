"use strict";

enum CmpType {
    WAIT_FOR_ASYNC_CALLBACK = "We wait until the JavaScript Object on the Page for the CMP was found",
    WAIT_FOR_TIME_FRAME = "We wait till the Callback should fire (maximal 5 seconds; 25 x 200 ms",
    DO_NOT_WAIT = "We don't wait for a callback, as we know the CMP is not TCF compliant"
}

export default CmpType;