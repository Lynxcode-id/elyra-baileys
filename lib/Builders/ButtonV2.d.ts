export class ButtonV2 extends BaseBuilder {
    constructor(client: any);
    _image: any;
    _data: any;
    _buttons: any[];
    loadFrom(msg: object): this;
    addButton(displayText?: string, buttonId?: string): this;
    addRawButton(obj: any): this;
    setThumbnail(path: any): this;
    setMedia(obj: any): this;
    button(displayText: any, buttonId: any): this;
    row(cb: (row: RowBuilder) => void): this;
    build(jid: any, opts1?: { [key: string]: any;
        viewOnce?: boolean;
    }): Promise<Record<string, any>>;
    send(jid: string, opts2?: { [key: string]: any; }): Promise<Record<string, any>>;
    #private;
}
import { BaseBuilder } from './shared.js';
import { RowBuilder } from './shared.js';
