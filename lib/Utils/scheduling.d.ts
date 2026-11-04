export class MessageScheduler {
    constructor(sendMessage: any, options?: {});
    queue: Map<any, any>;
    timer: any;
    sendMessage: any;
    options: {
        maxQueue: any;
        checkInterval: any;
        onSent: any;
        onFailed: any;
    };
    generateId(): string;
    schedule(jid: any, content: any, scheduledTime: any, repeatOptions: any): {
        id: string;
        jid: any;
        content: any;
        scheduledTime: any;
        createdAt: Date;
        status: string;
        repeatIntervalMs: any;
        maxRepeats: any;
        repeatCount: number;
    };
    scheduleDelay(jid: any, content: any, delayMs: any, repeatOptions: any): {
        id: string;
        jid: any;
        content: any;
        scheduledTime: any;
        createdAt: Date;
        status: string;
        repeatIntervalMs: any;
        maxRepeats: any;
        repeatCount: number;
    };
    cancel(id: any): boolean;
    cancelForJid(jid: any): number;
    getPending(): any[];
    get(id: any): any;
    clearAll(): number;
    processQueue(): Promise<void>;
    ensureTimerRunning(): void;
    stopTimer(): void;
    stop(): void;
    start(): void;
}
export function createMessageScheduler(sendMessage: any, options: any): MessageScheduler;
