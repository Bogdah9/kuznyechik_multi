import { encryptSync, decryptSync } from "./functions.mjs";
export const encrypt = encryptSync;
export const decrypt = decryptSync;
export default {
    encrypt: encryptSync,
    decrypt: decryptSync
};
