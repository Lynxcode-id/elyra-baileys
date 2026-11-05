export function readTcTokenIndex(keys: any): Promise<any[]>;
export function buildMergedTcTokenIndexWrite(keys: any, addedJids: any): Promise<{
    __index: {
        token: any;
    };
}>;
export function isTcTokenExpired(timestamp: any): boolean;
export function shouldSendNewTcToken(senderTimestamp: any): boolean;
export function resolveTcTokenJid(jid: any, getLIDForPN: any): Promise<any>;
export function resolveIssuanceJid(jid: any, issueToLid: any, getLIDForPN: any, getPNForLID: any): Promise<any>;
export function buildTcTokenFromJid(opts1: { [key: string]: any;
    authState: any;
    jid: any;
    baseContent?: any[];
    getLIDForPN: any;
}): Promise<any[]>;
export function storeTcTokensFromIqResult(opts2: { [key: string]: any;
    result: any;
    fallbackJid: any;
    keys: any;
    getLIDForPN: any;
    onNewJidStored: any;
}): Promise<void>;
export const TC_TOKEN_INDEX_KEY: "__index";
