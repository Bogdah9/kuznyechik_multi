export declare const async: {
    encrypt: (data: Buffer, masterkey: string | Buffer) => Promise<Buffer>;
    decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Promise<Buffer>;
};
export declare const multithreading: {
    encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
    decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
};
export declare const sync: {
    encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
    decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
};
declare const _default: {
    async: {
        encrypt: (data: Buffer, masterkey: string | Buffer) => Promise<Buffer>;
        decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Promise<Buffer>;
    };
    sync: {
        encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
        decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
    };
    multithreading: {
        encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
        decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
    };
};
export default _default;
