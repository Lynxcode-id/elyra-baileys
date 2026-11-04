export function buildInteractiveButtons(buttons?: any[]): any[];
export function validateAuthoringButtons(buttons: any): {
    errors: string[];
    warnings: any[];
    valid: boolean;
    cleaned: any[];
} | {
    errors: any[];
    warnings: string[];
    valid: boolean;
    cleaned: any[];
};
export function validateSendButtonsPayload(data: any): {
    valid: boolean;
    errors: string[];
    warnings: any[];
};
export function validateSendInteractiveMessagePayload(data: any): {
    valid: boolean;
    errors: string[];
    warnings: any[];
};
export function validateInteractiveMessageContent(content: any): {
    errors: any[];
    warnings: any[];
    valid: boolean;
};
export function convertToInteractiveMessage(content: any): any;
export function sendInteractiveMessage(sock: any, jid: string, content: Record<string, unknown>, options?: object): Promise<import("../index.js").proto.WebMessageInfo>;
export function sendInteractiveMessageV2(sock: any, jid: any, content: any, options?: {}): Promise<import("../index.js").proto.WebMessageInfo>;
export function sendButtons(sock: any, jid: any, data?: {
    text: string;
    buttons: any[];
}, options?: {}): Promise<import("../index.js").proto.WebMessageInfo>;
export class InteractiveValidationError extends Error {
    constructor(message: any, opts1?: { [key: string]: any;
        errors?: any[];
        warnings?: any[];
    });
    context: any;
    errors: any[];
    warnings: any[];
    example: any;
    toJSON(): {
        name: string;
        message: string;
        context: any;
        errors: any[];
        warnings: any[];
        example: any;
    };
    formatDetailed(): string;
}
