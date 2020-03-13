"use strict";

import URL from "../../../js/entities/URL";

describe('URL Tests', () => {


    it('URL Example orf.at', async function () {
        let url = new URL("https://www.orf.at");
        expect(url.isHttp).toBeTrue();
        expect(url.host).toEqual("www.orf.at");
        expect(url.url).toEqual("https://www.orf.at");
        expect(JSON.stringify(url)).toEqual("{\"url\":\"https://www.orf.at\"}");
        expect(Object.entries(url).length).toEqual(1);

        let url2 = URL.class(url);
        expect(url2.isHttp).toBeTrue();
        expect(url2.host).toEqual("www.orf.at");
        expect(url2.url).toEqual("https://www.orf.at");
        expect(JSON.stringify(url2)).toEqual("{\"url\":\"https://www.orf.at\"}");
        expect(Object.entries(url2).length).toEqual(1);
    });

    it('URL Example Chrome URL', async function () {
        let url = new URL("chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/options/options.html");
        expect(url.isHttp).toBeFalse();
        expect(url.host).toEqual("cgoaendlnmfajjjkhckajkmjinjinlkb");
        expect(url.url).toEqual("chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/options/options.html");
        expect(JSON.stringify(url)).toEqual("{\"url\":\"chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/options/options.html\"}");
        expect(Object.entries(url).length).toEqual(1);

        let url2 = URL.class(url);
        expect(url2.isHttp).toBeFalse();
        expect(url2.host).toEqual("cgoaendlnmfajjjkhckajkmjinjinlkb");
        expect(url2.url).toEqual("chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/options/options.html");
        expect(JSON.stringify(url2)).toEqual("{\"url\":\"chrome-extension://cgoaendlnmfajjjkhckajkmjinjinlkb/options/options.html\"}");
        expect(Object.entries(url2).length).toEqual(1);
    });

    it('URL Example #', async function () {
        let url3 = new URL("#");
        expect(url3.isHttp).toBeFalse();
        // expect(url3.host).toEqual("#"); -> This will not work, as in this case, the hostname from the current page (where we get the document form, will be taken
        expect(url3.url).toEqual("#");
        expect(JSON.stringify(url3)).toEqual("{\"url\":\"#\"}");
        expect(Object.entries(url3).length).toEqual(1);

        let url4 = URL.class(url3);
        expect(url4.isHttp).toBeFalse();
        // expect(url4.host).toEqual("#"); -> This will not work, as in this case, the hostname from the current page (where we get the document form, will be taken
        expect(url4.url).toEqual("#");
        expect(JSON.stringify(url4)).toEqual("{\"url\":\"#\"}");
        expect(Object.entries(url4).length).toEqual(1);
    });


    it('Missing Parameter 1', async function () {
        expect(function () {
            new URL();
        }).toThrow(new Error("URL String in Url must not be null"));
    });

    it('Undefined Parameter 1', async function () {
        expect(function () {
            new URL(undefined);
        }).toThrow(new Error("URL String in Url must not be null"));
    });

});