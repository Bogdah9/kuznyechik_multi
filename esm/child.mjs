import { decryptAsync, encryptAsync, EXPAND_KEYS } from "./functions.mjs";
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
                    cb = encryptAsync.bind({ EXPAND_KEYS: EXPAND_KEYS(Buffer.from(data.masterkey)) });
                    break;
                case "decrypt":
                    cb = decryptAsync.bind({ trimStart: false, EXPAND_KEYS: EXPAND_KEYS(Buffer.from(data.masterkey)) });
                    break;
            }
        }
        cb(Buffer.from(data.data)).then(x => process.send(x));
    });
})();
