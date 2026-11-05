export const RetryReason: any;
export class MessageRetryManager {
    constructor(logger: any, maxMsgRetryCount: any);
    logger: any;
    recentMessagesMap: any;
    messageKeyIndex: Map<any, any>;
    sessionRecreateHistory: any;
    retryCounters: any;
    baseKeys: any;
    pendingPhoneRequests: {};
    maxMsgRetryCount: any;
    statistics: {
        totalRetries: number;
        successfulRetries: number;
        failedRetries: number;
        mediaRetries: number;
        sessionRecreations: number;
        phoneRequests: number;
    };
    addRecentMessage(to: any, id: any, message: any): void;
    getRecentMessage(to: any, id: any): any;
    shouldRecreateSession(jid: any, hasSession: any, errorCode: any): {
        reason: string;
        recreate: boolean;
    };
    parseRetryErrorCode(errorAttr: any): any;
    isMacError(errorCode: any): boolean;
    incrementRetryCount(messageId: any): any;
    getRetryCount(messageId: any): any;
    hasExceededMaxRetries(messageId: any): boolean;
    markRetrySuccess(messageId: any): void;
    markRetryFailed(messageId: any): void;
    schedulePhoneRequest(messageId: any, callback: any, delay?: number): void;
    cancelPendingPhoneRequest(messageId: any): void;
    clear(): void;
    saveBaseKey(addr: any, msgId: any, baseKey: any): void;
    hasSameBaseKey(addr: any, msgId: any, baseKey: any): boolean;
    deleteBaseKey(addr: any, msgId: any): void;
    keyToString(key: any): string;
    removeRecentMessage(messageId: any): void;
}
