export function isBadMacError(error: any): any;
export function isSessionError(error: any): any;
export class BadMacHandler {
    constructor(options?: {
        maxRetries?: number;
        resetInterval?: number;
        authFolder?: string;
        logger?: {
            warn?: Function;
            error?: Function;
        };
        onLimit?: (stats: object) => void;
    });
    errorCount: number;
    maxRetries: number;
    resetInterval: number;
    lastReset: number;
    authFolder: string;
    logger: {
        warn?: Function;
        error?: Function;
    };
    onLimit: (stats: object) => void;
    isBadMacError(error: any): any;
    isSessionError(error: any): any;
    clearProblematicSessionFiles(opts1?: { [key: string]: any;
        dryRun?: boolean;
    }): Promise<string[]>;
    incrementErrorCount(): void;
    resetErrorCount(): void;
    hasReachedLimit(): boolean;
    handleError(error: any, context?: string): boolean;
    createSafeWrapper(fn: any, context: any): (...args: any[]) => Promise<any>;
    getStats(): {
        errorCount: number;
        maxRetries: number;
        lastReset: string;
        timeUntilReset: number;
    };
}
