import { encryptAsync, encryptSync, encryptChilds, decryptSync, decryptAsync, decryptChilds } from "./functions.mjs";
export const async = {
    encrypt: encryptAsync,
    decrypt: decryptAsync,
};
export const multithreading = {
    encrypt: encryptChilds,
    decrypt: decryptChilds,
};
export const sync = {
    encrypt: encryptSync,
    decrypt: decryptSync,
};
export default {
    async: async,
    sync: sync,
    multithreading: multithreading
};
