export function bindPaymentGuard(sock: any, hooks: PaymentGuardHooks): () => void;
export type PaymentGuardHooks = {
    isPaymentMessage: (webMessage: any) => boolean;
    recordEnvelope?: (webMessage: any, isPayment: boolean) => void;
    onDetect: (detection: PaymentDetection) => void;
    treatDecryptFailureAsSuspicious?: boolean;
};
export type PaymentDetection = {
    type: "direct" | "edited" | "undecryptable";
    remoteJid: string;
    participant: string | undefined;
    messageId: string | undefined;
    isPreKeyError?: boolean;
    errorMessage?: string;
};
