export function computeReconnectDelay(attempts: number, opts1?: { [key: string]: any;
    baseMs?: number;
    capMs?: number;
}): number;
export function createReconnectBackoff(opts?: {}): {
    next(): number;
    reset(): void;
    readonly attempts: number;
};
