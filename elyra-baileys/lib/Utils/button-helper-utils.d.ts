export function getMediaType(message: import("../../WAProto/index.js").proto.IMessage): "" | "image" | "video" | "audio" | "document" | "url" | "product" | "gif" | "ptt" | "vcard" | "contact_array" | "livelocation" | "sticker" | "list" | "list_response" | "buttons_response" | "order" | "native_flow_response";
export function getMessageType(message: import("../../WAProto/index.js").proto.IMessage): "text" | "media" | "reaction" | "poll" | "event";
export function getButtonType(message: import("../../WAProto/index.js").proto.IMessage): "list" | "buttons" | "native_flow";
export function getButtonArgs(message: import("../../WAProto/index.js").proto.IMessage): any;
export function buildMentionContextInfo(message: any): {
    contextInfo: {
        nonJidMentions: number;
        mentionedJid?: undefined;
    };
} | {
    contextInfo: {
        mentionedJid: any;
        nonJidMentions?: undefined;
    };
} | {
    contextInfo: {
        nonJidMentions?: undefined;
        mentionedJid?: undefined;
    };
};
export function extractFromButtonsMessage(msg: any): {
    imageMessage: any;
    videoMessage?: undefined;
    documentMessage?: undefined;
} | {
    videoMessage: any;
    imageMessage?: undefined;
    documentMessage?: undefined;
} | {
    documentMessage: any;
    imageMessage?: undefined;
    videoMessage?: undefined;
};
export function normalizeMediaInput(media: any): any;
export function patchMessageForMdIfRequired(message: any): any;
export function prepareAlbumMessageContent(jid: string, albums: Array<object>, options: {
    userJid: string;
    suki: {
        relayMessage: Function;
        waUploadToServer: Function;
    };
}): Promise<Array<object>>;
export function makeMessageExtrasAddon(ctx: {
    query: Function;
    newsletterWMexQuery?: Function;
}): {
    profilePictureUrl: (jid: any) => Promise<any>;
    getEphemeralGroup: (jid: any) => Promise<number | string>;
};
