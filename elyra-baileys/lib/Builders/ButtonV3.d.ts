export class ButtonV3 extends BaseBuilder {
    constructor(client: any);
    _data: any;
    _mediaHeaderType: string;
    _buttons: any[];
    loadFrom(msg: any): this;
    setImage(path: any, options?: {}): this;
    setVideo(path: any, options?: {}): this;
    setDocument(path: any, options?: {}): this;
    setMedia(obj: any): this;
    clearButtons(): this;
    addButton(hydratedButton: any): this;
    addReply(display_text?: string, id?: string): this;
    addUrl(display_text?: string, url?: string, options?: {}): this;
    addCall(display_text?: string, phone_number?: string): this;
    toTemplate(): Promise<{
        hydratedContentText: string;
        hydratedFooterText: string;
        hydratedButtons: any[];
    }>;
    build(jid: any, opts1?: { [key: string]: any; }): Promise<import("../../WAProto/index.js").proto.WebMessageInfo>;
    send(jid: any, opts2?: { [key: string]: any;
        additionalNodes?: any[];
    }): Promise<import("../../WAProto/index.js").proto.WebMessageInfo>;
    #private;
}
import { BaseBuilder } from './shared.js';
