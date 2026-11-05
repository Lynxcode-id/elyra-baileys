export namespace DISAPPEARING_DURATIONS {
    let OFF: number;
    let HOURS_24: number;
    let DAYS_7: number;
    let DAYS_90: number;
}
export class TypingIndicator {
    constructor(sendPresence: any);
    sendPresence: any;
    timers: Map<any, any>;
    startTyping(jid: any, options?: {}): Promise<void>;
    startRecording(jid: any, options?: {}): Promise<void>;
    stopTyping(jid: any): Promise<void>;
    stopAll(): Promise<void>;
    simulateTyping<T>(jid: any, durationMs: any, callback: any): Promise<any>;
    clearTimer(jid: any): void;
}
export function createTypingIndicator(sendPresence: any): TypingIndicator;
export class PinnedMessagesManager {
    store: Map<any, any>;
    pin(jid: any, messageId: any, pinnedBy: any, expiresAt: any): {
        messageId: any;
        jid: any;
        pinnedAt: Date;
        pinnedBy: any;
        expiresAt: any;
    };
    unpin(jid: any, messageId: any): boolean;
    getPinned(jid: any): any;
    isPinned(jid: any, messageId: any): any;
    clearPins(jid: any): void;
    clearExpired(): number;
    get totalPins(): number;
}
export function createPinnedMessagesManager(): PinnedMessagesManager;
export function createReadReceiptController(sendReadReceipt: any, config?: {}): {
    setConfig(newConfig: any): void;
    getConfig(): {
        enabled: any;
        excludeJids: any;
        readDelay: any;
    };
    enable(): void;
    disable(): void;
    isEnabled(): any;
    markRead(jid: any, participant: any, messageIds: any): Promise<void>;
    forceMarkRead(jid: any, participant: any, messageIds: any): Promise<void>;
};
