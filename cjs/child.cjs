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
    let cb = undefined;
    process.on('message', (data) => {
        if (!cb) {
            switch (data.type) {
                case "encrypt":
                    cb = functions_cjs_1.encryptAsync.bind({ EXPAND_KEYS: (0, functions_cjs_1.EXPAND_KEYS)(Buffer.from(data.masterkey)) });
                    break;
                case "decrypt":
                    cb = functions_cjs_1.decryptAsync.bind({ trimStart: false, EXPAND_KEYS: (0, functions_cjs_1.EXPAND_KEYS)(Buffer.from(data.masterkey)) });
                    break;
            }
        }
        cb(Buffer.from(data.data)).then(x => process.send(x));
    });
})();
