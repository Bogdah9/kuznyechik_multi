export declare const encrypt: (data: Buffer, masterkey: string | Buffer) => Promise<Buffer>;
export declare const decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Promise<Buffer>;
