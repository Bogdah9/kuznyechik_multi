import { randomBytes } from "node:crypto";
import { decryptChilds, encryptChilds } from "../functions.mjs";
import { cpus } from "node:os";
import { EQ } from "./checkerFunctions.mjs";
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
 * @param size размер псевдослучайных данных в МБайтах (до 2 ГБайт = 2048) указав 0 будет 2ГБайта
 */
export default async (size = 512) => {
    let rb = size;
    if (size === 0)
        rb = 2 ** 31 - 1;
    else
        rb *= 1024 * 1024;
    let data = randomBytes(rb);
    let key = randomBytes(32).toString("hex");
    let start = +new Date();
    let cp = cpus();
    let childs = cpus().length;
    console.log("Многопоточное шифрование/дешифрование (nodejs only), размер данных " + (data.length / (1024 * 1024)).toFixed(3) + " Мбайта ");
    console.log("Процессор                     : " + cp[0].model);
    console.log("Колличесво дочерник процессов : " + childs);
    let eBuff = await encryptChilds(Buffer.from(data), key, childs);
    console.log("Заняло времени шифрование     : " + (((+new Date()) - start) / 1000) + "c");
    console.log("Скорость шифрования           : " + speed(data.length, (((+new Date()) - start) / 1000)));
    start = +new Date();
    let dBuff = await decryptChilds(Buffer.from(eBuff), key, childs);
    console.log("Заняло времени дешифрование   : " + (((+new Date()) - start) / 1000) + "c");
    console.log("Скорость дешифрование         : " + speed(data.length, (((+new Date()) - start) / 1000)) + "\n\n");
    console.log("Проверка на равенство исходных данных и шифрованных   : ", EQ(data, eBuff));
    console.log("Проверка на равенство исходных данных и дешифрованных : ", EQ(data, dBuff));
};
