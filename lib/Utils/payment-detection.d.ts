export function hasPaymentMessage(webMessage: any): boolean;
export function getQuotedPaymentContext(webMessage: any): any;
export function recordMessageEnvelope(webMessage: any, isPayment: any): void;
export function verifyQuotedAuthor(opts1: { [key: string]: any;
    groupJid: any;
    stanzaId: any;
    participant: any;
}): {
    corroborated: boolean;
    contradicted: boolean;
};
export function __clearEnvelopeRegistry(): void;
export function extractPaymentAmount(webMessage: any): {
    value: number;
    currencyCode: any;
};
