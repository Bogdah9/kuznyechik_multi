"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const functions_cjs_1 = require("../functions.cjs");
const node_os_1 = require("node:os");
const checkerFunctions_cjs_1 = require("./checkerFunctions.cjs");
const speed = (length, time) => {
    let speed = length / time;
    if (speed / 1024 < 1)
        return (speed).toFixed(2) + " " + 'Байт/с';
    if ((speed / (1024 * 1024)) < 1)
        return (speed / (1024)).toFixed(2) + " " + 'КБайта/с';
    if ((speed / (1024 * 1024 * 1024)) < 1)
        return (speed / (1024 * 1024)).toFixed(2) + " " + 'МБайта/с';
    return (speed / (1024 * 1024 * 1024)).toFixed(2) + " " + 'ГБайта/с';
};
/**
 * Функция проверки скорости шифрования размер псевдослучайных данных указывать в МБайтах
 * @param size размер псевдослучайных данных в МБайтах (до 2 ГБайт = 2048) указав 0 будет колличество ядер*2 в МБайтах
 */
exports.default = async (size = 0) => {
    let cp = (0, node_os_1.cpus)();
    let childs = (0, node_os_1.cpus)().length;
    let rb = size;
    if (size === 0) {
        rb = childs * 1024 * 1024 * 2;
    }
    else
        rb *= 1024 * 1024;
    let data = (0, node_crypto_1.randomBytes)(rb);
    let key = (0, node_crypto_1.randomBytes)(32).toString("hex");
    let start = +new Date();
    console.log("Многопоточное шифрование/дешифрование (nodejs only), размер данных " + (data.length / (1024 * 1024)).toFixed(3) + " Мбайта ");
    console.log("Процессор                     : " + cp[0].model);
    console.log("Колличесво дочерник процессов : " + childs);
    let eBuff = await (0, functions_cjs_1.encryptChilds)(Buffer.from(data), key, childs);
    console.log("Заняло времени шифрование     : " + (((+new Date()) - start) / 1000) + "c");
    console.log("Скорость шифрования           : " + speed(data.length, (((+new Date()) - start) / 1000)));
    start = +new Date();
    let dBuff = await (0, functions_cjs_1.decryptChilds)(Buffer.from(eBuff), key, childs);
    console.log("Заняло времени дешифрование   : " + (((+new Date()) - start) / 1000) + "c");
    console.log("Скорость дешифрование         : " + speed(data.length, (((+new Date()) - start) / 1000)) + "\n\n");
    console.log("Проверка на равенство исходных данных и шифрованных   : ", (0, checkerFunctions_cjs_1.EQ)(data, eBuff));
    console.log("Проверка на равенство исходных данных и дешифрованных : ", (0, checkerFunctions_cjs_1.EQ)(data, dBuff));
};
