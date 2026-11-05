export class Carousel extends BaseBuilder {
    static MAX_CARDS: number;
    constructor(client: any);
    _cards: any[];
    loadFrom(msg: object): this;
    addCard(card: Record<string, any> | Record<string, any>[]): this;
    clearCards(): this;
    get cardCount(): number;
    makeCard(opts3?: { [key: string]: any;
        image?: string | Buffer;
        video?: string | Buffer;
        gifPlayback?: boolean;
        body?: string;
        footer?: string;
        title?: string;
        subtitle?: string;
        buttons?: Array<{
            name: string;
            params?: any;
            buttonParamsJson?: string;
        }>;
        params?: string | object;
    }): Promise<{
        header: {
            hasMediaAttachment: boolean;
            title: string;
            subtitle: string;
        };
        body: {
            text: string;
        };
        footer: {
            text: string;
        };
        nativeFlowMessage: {
            buttons: {
                name: string;
                buttonParamsJson: string;
            }[];
            messageParamsJson?: string;
        };
    }>;
    build(jid: any, opts1?: { [key: string]: any; }): Record<string, any>;
    send(jid: string, opts2?: { [key: string]: any; }): Promise<Record<string, any>>;
    #private;
}
import { BaseBuilder } from './shared.js';
