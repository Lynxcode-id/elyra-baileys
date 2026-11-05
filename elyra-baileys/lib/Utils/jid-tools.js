import { Boom } from '@hapi/boom';
import { jidDecode } from '../WABinary/index.js';
export const getPhoneNumber = async (sock, jid) => {
    if (typeof jid !== 'string' || !jid.includes('@')) {
        throw new Boom('getPhoneNumber(jid) requires a JID string', { statusCode: 400 });
    }
    let decoded;
    try {
        decoded = jidDecode(jid);
    }
    catch {
        throw new Boom(`getPhoneNumber: invalid JID ${jid}`, { statusCode: 400 });
    }
    const { user, server } = decoded;
    if (server === 's.whatsapp.net') {
        return user;
    }
    if (server === 'lid') {
        const store = sock?.signalRepository?.lidMapping;
        if (!store || typeof store.getPNForLID !== 'function') {
            throw new Boom('getPhoneNumber: LID resolution needs an active socket', { statusCode: 400 });
        }
        try {
            const pn = await store.getPNForLID(`${user}@lid`);
            return typeof pn === 'string' && pn.includes('@') ? pn.split('@')[0] : null;
        }
        catch {
            return null;
        }
    }
    return null;
};
export const resolveSenderPn = async (sock, webMessage) => {
    const sender = webMessage?.key?.participant || webMessage?.key?.remoteJid;
    if (!sender || typeof sender !== 'string') {
        throw new Boom('resolveSenderPn(msg) needs a message with key.participant/remoteJid', { statusCode: 400 });
    }
    return getPhoneNumber(sock, sender);
};
export const getLidForPhone = async (sock, phone) => {
    const store = sock?.signalRepository?.lidMapping;
    if (!store || typeof store.getLIDForPN !== 'function') {
        throw new Boom('getLidForPhone(sock, ...) requires an active socket', { statusCode: 400 });
    }
    const pn = typeof phone === 'string' && phone.includes('@')
        ? phone
        : `${String(phone || '').replace(/\D/g, '')}@s.whatsapp.net`;
    if (!pn.split('@')[0]) {
        throw new Boom('getLidForPhone(phone) requires a phone number', { statusCode: 400 });
    }
    try {
        return (await store.getLIDForPN(pn)) || null;
    }
    catch {
        return null;
    }
};
