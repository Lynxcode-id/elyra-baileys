export function waChatKey(pin: any): {
    key: (c: any) => string;
    compare: (k1: any, k2: any) => any;
};
export function waMessageID(m: any): any;
export namespace waLabelAssociationKey {
    function key(la: any): any;
    function compare(k1: any, k2: any): any;
}
export function makeInMemoryStore(config?: {}): {
    chats: any;
    contacts: {};
    messages: {};
    groupMetadata: {};
    state: {
        connection: string;
    };
    presences: {};
    labels: ObjectRepository;
    labelAssociations: any;
    bind: (ev: any) => void;
    loadMessages: (jid: any, count: any, cursor: any) => Promise<any>;
    getLabels: () => ObjectRepository;
    getChatLabels: (chatId: any) => any;
    getMessageLabels: (messageId: any) => any;
    loadMessage: (jid: any, id: any) => Promise<any>;
    mostRecentMessage: (jid: any) => Promise<any>;
    fetchImageUrl: (jid: any, sock: any) => Promise<any>;
    fetchGroupMetadata: (jid: any, sock: any) => Promise<any>;
    fetchMessageReceipts: (opts1: { [key: string]: any;
        remoteJid: any;
        id: any;
    }) => Promise<any>;
    toJSON: () => {
        chats: any;
        contacts: {};
        messages: {};
        labels: ObjectRepository;
        labelAssociations: any;
    };
    fromJSON: (json: any) => void;
    writeToFile: (path: any) => void;
    readFromFile: (path: any) => void;
};
import { ObjectRepository } from './object-repository.js';
