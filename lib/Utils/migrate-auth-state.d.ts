export function migrateAuthState(opts1: { [key: string]: any;
    from: any;
    to: any;
    batchSize?: number;
    skipExisting?: boolean;
    logger: any;
    verify?: boolean;
}): Promise<{
    creds: {
        copied: boolean;
    };
    counts: {};
    verified: boolean;
    warnings: any[];
}>;
export const ALL_TYPES: string[];
