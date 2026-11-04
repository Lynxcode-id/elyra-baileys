export function setupConnectionWatchdog(sock: any, opts1?: { [key: string]: any;
    idleThresholdMs?: number;
    checkIntervalMs?: number;
    probe?: "ping" | "presence";
}): () => void;
