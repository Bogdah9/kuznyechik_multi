import { decryptAsync, encryptAsync } from "./functions.mjs";
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
                encryptAsync(Buffer.from(data.data), Buffer.from(data.masterkey)).then(x => process.send(x));
                break;
            case "decrypt":
                decryptAsync(Buffer.from(data.data), Buffer.from(data.masterkey), false).then(x => process.send(x));
                break;
        }
    });
})();
