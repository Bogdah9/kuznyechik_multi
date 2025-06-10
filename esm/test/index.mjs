import { randomBytes } from "node:crypto";
import { decryptAsync, encryptAsync } from "../functions.mjs";
import checkSpeed from "./checkSpeed.mjs";
const TEXT = (() => {
    let start = 1040;
    let size = 64;
    return "\n\t" + Array.from({ length: size }).reduce((acc, x, i) => {
        acc.i += 1;
        acc.str += String.fromCharCode(i + start) + " ";
        if (acc.i === 8 || i == 31) {
            acc.i = 0;
            acc.str += '\n\t' + (i == 31 ? "\n\t" : '');
        }
        return acc;
    }, { str: '', i: 0 }).str;
})();
export default async (msg = TEXT, size = 0) => {
    const KEY_TRUE = randomBytes(32).toString("hex");
    let data = Buffer.from(msg, 'utf8');
    console.log("Пример работоспособности шифра: ");
    console.log("\t Ключ 32 байта (HEX)    : " + KEY_TRUE);
    console.log("\t Исходный текст(HEX)    : " + data.toString('hex') + '');
    let eBuff = await encryptAsync(data, KEY_TRUE);
    console.log("\t Шифротекст(HEX)        : " + eBuff.reduce((acc, x) => acc + x.toString(16), '') + '');
    console.log("\tРасшифрованный(UTF-8)   : ");
    console.log(new TextDecoder().decode(await decryptAsync(eBuff, KEY_TRUE)) + '\n\n');
    await checkSpeed(size);
};
