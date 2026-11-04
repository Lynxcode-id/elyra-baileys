export class Expiring {
    constructor(client: object, builder: {
        send: Function;
    }, seconds?: number);
    _client: any;
    _builder: {
        send: Function;
    };
    _seconds: number;
    send(jid: any, opts?: {}): Promise<any>;
}
export { Expiring as ExpiringButton };
