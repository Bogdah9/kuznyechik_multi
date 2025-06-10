"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const functions_cjs_1 = require("../functions.cjs");
const checkSpeed_cjs_1 = __importDefault(require("./checkSpeed.cjs"));
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
exports.default = async (msg = TEXT, size = 512) => {
    const KEY_TRUE = (0, node_crypto_1.randomBytes)(32).toString("hex");
    let data = Buffer.from(msg, 'utf8');
    console.log("\tПример работоспособности шифра (браузерная версия) асинхронно: ");
    console.log("\t Ключ 32 байта (HEX): " + KEY_TRUE);
    console.log("\t Исходный текст(HEX)    : " + data.toString('hex').toUpperCase() + '');
    let eBuff = await (0, functions_cjs_1.encryptAsync)(data, KEY_TRUE);
    console.log("\t Шифротекст(HEX)    : ", eBuff.reduce((acc, x) => acc + x.toString(16), '').toUpperCase() + '');
    console.log("\t\tРасшифрованный(UTF-8)    : ");
    console.log(new TextDecoder().decode(await (0, functions_cjs_1.decryptAsync)(eBuff, KEY_TRUE)) + '\n\n');
    await (0, checkSpeed_cjs_1.default)(size);
};
