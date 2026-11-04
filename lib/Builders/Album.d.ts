export class Album extends BaseBuilder {
    static get MAX_ITEMS(): number;
    constructor(client: object);
    _items: any[];
    _caption: string;
    _delayMs: any;
    _continueOnError: boolean;
    addImage(source: Buffer | {
        url: string;
    } | {
        stream: any;
    }, caption?: string, extra?: object): this;
    addVideo(source: Buffer | {
        url: string;
    } | {
        stream: any;
    }, caption?: string, extra?: object): this;
    addMany(items: any): this;
    setCaption(caption: any): this;
    setDelay(ms: any): this;
    setContinueOnError(v?: boolean): this;
    build(): {
        album: object[];
        caption?: string;
    };
    send(jid: any, options?: {}): Promise<object>;
    #private;
}
import { BaseBuilder } from './shared.js';
