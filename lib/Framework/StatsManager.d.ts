export class StatsManager {
    static create(dbPath: any, groupMetaFn: any): Promise<StatsManager>;
    constructor(db: any, groupMetaFn: any);
    db: any;
    groupMetaFn: any;
    insertStmt: any;
    getStatsStmt: any;
    getTopMsgStmt: (limit: any) => any;
    getTopStickerStmt: (limit: any) => any;
    observeMessage(groupJid: any, userJid: any, isSticker: any): void;
    getTopUsers(groupJid: any, limit?: number): any;
    getTopStickers(groupJid: any, limit?: number): any;
    getGhosts(groupJid: any, socketConnected: any, inactiveDays?: number): Promise<any>;
    close(): void;
}
