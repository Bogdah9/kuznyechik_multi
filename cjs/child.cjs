"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_cjs_1 = require("./functions.cjs");
const NUM_TO_HEX = (a) => a < 16 ? "0" + a.toString(16) : a.toString(16);
const BUFF_TO_TEXT = (a) => "[ " + Array.from(a).map(NUM_TO_HEX).join(' ') + " ]";
(() => {
    if (!process.send) {
        process.kill(1);
        return;
    }
    process.send({ message: "I_LIVE" });
    process.on('message', (data) => {
        switch (data.type) {
            case "encrypt":
                (0, functions_cjs_1.encryptAsync)(Buffer.from(data.data), Buffer.from(data.masterkey)).then(x => process.send(x));
                break;
            case "decrypt":
                (0, functions_cjs_1.decryptAsync)(Buffer.from(data.data), Buffer.from(data.masterkey), false).then(x => process.send(x));
                break;
        }
    });
})();
