declare const _default: {
    async: {
        encrypt: (data: Uint8Array, masterkey: string | Uint8Array) => Promise<Uint8Array>;
        decrypt: (data: Uint8Array, masterkey: string | Uint8Array, trimStart?: boolean) => Promise<Uint8Array>;
    };
    sync: {
        encrypt: (data: Uint8Array, masterkey: string | Uint8Array) => Uint8Array;
        decrypt: (data: Uint8Array, masterkey: string | Uint8Array, trimStart?: boolean) => Uint8Array;
    };
};
export default _default;
