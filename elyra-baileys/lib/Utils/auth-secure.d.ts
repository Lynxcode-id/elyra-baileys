export function deriveKey(password: any, salt: any): any;
export function encryptJSON(value: any, password: any): string;
export function decryptJSON(payload: any, password: any): any;
export function isEncryptedPayload(value: any): boolean;
export function useEncryptedFileAuthState(folder: string, opts: {
    password: string;
    logger?: any;
}): Promise<{
    state: {
        creds: any;
        keys: {
            get: (type: any, ids: any) => Promise<{}>;
            set: (data: any) => Promise<void>;
        };
    };
    saveCreds: () => any;
    clearState: () => Promise<void>;
}>;
export function useEncryptedSingleFileAuthState(file: any, opts: any): Promise<{
    state: {
        creds: any;
        keys: {
            get: (type: any, ids: any) => Promise<{}>;
            set: (data: any) => Promise<void>;
        };
    };
    saveCreds: () => Promise<void>;
    flush: () => Promise<void>;
    clearState: () => Promise<void>;
}>;
export function backupAuthState(src: any, outFile: any, opts1?: { [key: string]: any; }): Promise<{
    outFile: any;
    files: number;
    createdAt: string;
}>;
export function restoreAuthState(backupFile: any, dest: any, opts2?: { [key: string]: any; }): Promise<{
    dest: any;
    files: number;
    createdAt: any;
}>;
export function writeAuthIntegrity(folder: any, opts3?: { [key: string]: any; }): Promise<{
    createdAt: string;
    hmac: boolean;
    sums: {};
}>;
export function verifyAuthIntegrity(folder: any, opts4?: { [key: string]: any; }): Promise<{
    ok: boolean;
    error: string;
    mismatched: any[];
    missing: any[];
    extra: any[];
} | {
    ok: boolean;
    mismatched: string[];
    missing: string[];
    extra: any[];
    error?: undefined;
}>;
export function repairAuthState(folder: any, opts5?: { [key: string]: any; }): Promise<{
    ok: boolean;
    checked: number;
    quarantined: any[];
    credsRestored: boolean;
}>;
export function createRateLimiter(opts10?: { [key: string]: any;
    max?: number;
    windowMs?: number;
    minIntervalMs?: number;
    now?: () => number;
}): {
    stats: {
        allowed: number;
        blocked: number;
    };
    check(key?: string): {
        allowed: boolean;
        retryAfterMs: number;
    };
    reset(key: any): void;
};
export function withPairingGuard(sock: any, opts6?: { [key: string]: any;
    maxPerHour?: number;
    globalMaxPerHour?: number;
    minIntervalMs?: number;
}): {
    restore: () => void;
    limiter: any;
    global: any;
};
export function createQRGuard(opts11?: { [key: string]: any;
    ttlMs?: number;
    now?: () => number;
}): {
    stats: {
        passed: number;
        blocked: number;
    };
    handle(qr: any): any;
    reset(): void;
    readonly active: boolean;
};
export function redactSecrets(value: any, opts7?: { [key: string]: any;
    extraKeys?: any[];
    maxDepth?: number;
}): any;
export function secureLogger(base: any, opts8?: { [key: string]: any; }): any;
export function secureLogout(sock: any, opts9?: { [key: string]: any;
    passes?: number;
}): Promise<{
    loggedOut: boolean;
    wiped: any[];
    credsScrubbed: boolean;
}>;
export const ENC_MAGIC: "JAPENC1";
export const BACKUP_MAGIC: "JAPBACKUP1";
