export class Toolkit {
    static #latexDimCache: Map<any, any>;
    static extractIE(text: any, opts1?: { [key: string]: any;
        extract?: boolean;
        hyperlink?: boolean;
        citation?: boolean;
        latex?: boolean;
        deeplink?: boolean;
    }): {
        text: any;
        ie: any[];
        inline_entities: any[];
    } | {
        text: string;
        ie: ({
            type: string;
            ie: {
                key: string;
                text: any;
                url: any;
                width: any;
                height: any;
                font_height: any;
                padding: any;
                is_trusted?: undefined;
                reference_id?: undefined;
            };
        } | {
            type: string;
            ie: {
                key: string;
                text: any;
                url: any;
                width?: undefined;
                height?: undefined;
                font_height?: undefined;
                padding?: undefined;
                is_trusted?: undefined;
                reference_id?: undefined;
            };
        } | {
            type: string;
            ie: {
                key: string;
                text: any;
                url: any;
                is_trusted: boolean;
                width?: undefined;
                height?: undefined;
                font_height?: undefined;
                padding?: undefined;
                reference_id?: undefined;
            };
        } | {
            type: string;
            ie: {
                reference_id: number;
                key: string;
                text: string;
                url: any;
                width?: undefined;
                height?: undefined;
                font_height?: undefined;
                padding?: undefined;
                is_trusted?: undefined;
            };
        })[];
        inline_entities: ({
            key: any;
            metadata: {
                display_name: any;
                is_trusted: any;
                url: any;
                __typename: string;
                deeplink_url?: undefined;
                text?: undefined;
                reference_id?: undefined;
                reference_url?: undefined;
                reference_title?: undefined;
                reference_display_name?: undefined;
                sources?: undefined;
                latex_expression?: undefined;
                latex_image?: undefined;
                font_height?: undefined;
                padding?: undefined;
            };
        } | {
            key: any;
            metadata: {
                deeplink_url: any;
                text: any;
                __typename: string;
                display_name?: undefined;
                is_trusted?: undefined;
                url?: undefined;
                reference_id?: undefined;
                reference_url?: undefined;
                reference_title?: undefined;
                reference_display_name?: undefined;
                sources?: undefined;
                latex_expression?: undefined;
                latex_image?: undefined;
                font_height?: undefined;
                padding?: undefined;
            };
        } | {
            key: any;
            metadata: {
                reference_id: any;
                reference_url: any;
                reference_title: any;
                reference_display_name: any;
                sources: any[];
                __typename: string;
                display_name?: undefined;
                is_trusted?: undefined;
                url?: undefined;
                deeplink_url?: undefined;
                text?: undefined;
                latex_expression?: undefined;
                latex_image?: undefined;
                font_height?: undefined;
                padding?: undefined;
            };
        } | {
            key: any;
            metadata: {
                latex_expression: any;
                latex_image: {
                    url: any;
                    width: number;
                    height: number;
                };
                font_height: number;
                padding: number;
                __typename: string;
                display_name?: undefined;
                is_trusted?: undefined;
                url?: undefined;
                deeplink_url?: undefined;
                text?: undefined;
                reference_id?: undefined;
                reference_url?: undefined;
                reference_title?: undefined;
                reference_display_name?: undefined;
                sources?: undefined;
            };
        })[];
    };
    static resize(buffer: any, x: any, y: any, fit?: string): Promise<any>;
    static stringifyEscaped(obj: any): string;
    static waitAllPromises(input: any): Promise<any>;
    static fetchBuffer(url: any, options?: {}, opts2?: { [key: string]: any;
        silent?: boolean;
        timeout?: number;
    }): Promise<any>;
    static toUrl(_client: any, path: any, mediaType?: string): Promise<any>;
    static resolveMedia(_client: any, media: any, mediaType?: string, opts3?: { [key: string]: any;
        resolveUrl?: boolean;
        resolveWAUrl?: boolean;
        result?: string;
        resize?: boolean;
        width?: number;
        height?: number;
    }): any;
    static getMp4Duration(buffer: any, opts4?: { [key: string]: any;
        silent?: boolean;
    }): number;
    static getMp4Preview(videoBuffer: any, opts5?: { [key: string]: any;
        result?: string;
        resize?: boolean;
        width?: number;
        height?: number;
        silent?: boolean;
    }): Promise<any>;
    static getImageSize(buffer: any): {
        width: any;
        height: any;
    };
    static resolveLatexDimensions(url: any, fontHeight?: number): Promise<any>;
}
export class BaseBuilder {
    _title: string;
    _subtitle: string;
    _body: string;
    _footer: string;
    _contextInfo: {};
    _extraPayload: {};
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setBody(body: string): this;
    setBotGroupParticipants(...fbids: string[]): this;
    setFooter(footer: string): this;
    setContextInfo(obj: Record<string, any>): this;
    addPayload(obj: any): this;
}
export class RowBuilder {
    buttons: any[];
    button(displayText: any, buttonId: any): this;
}
export function extractIE(text: any, opts6?: { [key: string]: any;
    extract?: boolean;
    hyperlink?: boolean;
    citation?: boolean;
    latex?: boolean;
    deeplink?: boolean;
}): {
    text: any;
    ie: any[];
    inline_entities: any[];
} | {
    text: string;
    ie: ({
        type: string;
        ie: {
            key: string;
            text: any;
            url: any;
            width: any;
            height: any;
            font_height: any;
            padding: any;
            is_trusted?: undefined;
            reference_id?: undefined;
        };
    } | {
        type: string;
        ie: {
            key: string;
            text: any;
            url: any;
            width?: undefined;
            height?: undefined;
            font_height?: undefined;
            padding?: undefined;
            is_trusted?: undefined;
            reference_id?: undefined;
        };
    } | {
        type: string;
        ie: {
            key: string;
            text: any;
            url: any;
            is_trusted: boolean;
            width?: undefined;
            height?: undefined;
            font_height?: undefined;
            padding?: undefined;
            reference_id?: undefined;
        };
    } | {
        type: string;
        ie: {
            reference_id: number;
            key: string;
            text: string;
            url: any;
            width?: undefined;
            height?: undefined;
            font_height?: undefined;
            padding?: undefined;
            is_trusted?: undefined;
        };
    })[];
    inline_entities: ({
        key: any;
        metadata: {
            display_name: any;
            is_trusted: any;
            url: any;
            __typename: string;
            deeplink_url?: undefined;
            text?: undefined;
            reference_id?: undefined;
            reference_url?: undefined;
            reference_title?: undefined;
            reference_display_name?: undefined;
            sources?: undefined;
            latex_expression?: undefined;
            latex_image?: undefined;
            font_height?: undefined;
            padding?: undefined;
        };
    } | {
        key: any;
        metadata: {
            deeplink_url: any;
            text: any;
            __typename: string;
            display_name?: undefined;
            is_trusted?: undefined;
            url?: undefined;
            reference_id?: undefined;
            reference_url?: undefined;
            reference_title?: undefined;
            reference_display_name?: undefined;
            sources?: undefined;
            latex_expression?: undefined;
            latex_image?: undefined;
            font_height?: undefined;
            padding?: undefined;
        };
    } | {
        key: any;
        metadata: {
            reference_id: any;
            reference_url: any;
            reference_title: any;
            reference_display_name: any;
            sources: any[];
            __typename: string;
            display_name?: undefined;
            is_trusted?: undefined;
            url?: undefined;
            deeplink_url?: undefined;
            text?: undefined;
            latex_expression?: undefined;
            latex_image?: undefined;
            font_height?: undefined;
            padding?: undefined;
        };
    } | {
        key: any;
        metadata: {
            latex_expression: any;
            latex_image: {
                url: any;
                width: number;
                height: number;
            };
            font_height: number;
            padding: number;
            __typename: string;
            display_name?: undefined;
            is_trusted?: undefined;
            url?: undefined;
            deeplink_url?: undefined;
            text?: undefined;
            reference_id?: undefined;
            reference_url?: undefined;
            reference_title?: undefined;
            reference_display_name?: undefined;
            sources?: undefined;
        };
    })[];
};
export function waitAllPromises(input: any): Promise<any>;
export function getSharp(): Promise<any>;
export function getFfmpeg(): Promise<any>;
import { generateWAMessageFromContent } from '../Utils/messages.js';
import { prepareWAMessageMedia } from '../Utils/messages.js';
import { generateMessageIDV2 } from '../Utils/generics.js';
import { botMetadataSignature } from '../Utils/rich-message-utils.js';
import { botMetadataCertificate } from '../Utils/rich-message-utils.js';
import { getBizBinaryNode } from '../WABinary/index.js';
export { generateWAMessageFromContent, prepareWAMessageMedia, generateMessageIDV2, botMetadataSignature, botMetadataCertificate, getBizBinaryNode };
