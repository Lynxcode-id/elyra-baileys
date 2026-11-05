export function autoReconnect(socketFactory: any, options?: {}): {
    start: () => Promise<any>;
    stop: () => Promise<void>;
    readonly socket: any;
    readonly attempts: number;
};
