import { Boom } from '@hapi/boom';
const participantJids = (participants) => (participants || [])
    .map((p) => (typeof p === 'string' ? p : p?.id))
    .filter((j) => typeof j === 'string' && j.includes('@'));
export const buildTagContent = (participants, text = '', { hide = false } = {}) => {
    const mentions = participantJids(participants);
    if (!mentions.length) {
        throw new Boom('tagAll: no participants to mention', { statusCode: 400 });
    }
    const body = hide
        ? String(text || '')
        : `${String(text || '')}\n${mentions.map((j) => `@${j.split('@')[0]}`).join(' ')}`.trim();
    return { text: body, mentions };
};
const assertGroupSock = (sock, jid) => {
    if (!sock || typeof sock.sendMessage !== 'function' || typeof sock.groupMetadata !== 'function') {
        throw new Boom('tagAll(sock, ...) requires an active Baileys socket with groupMetadata', { statusCode: 400 });
    }
    if (typeof jid !== 'string' || !jid.endsWith('@g.us')) {
        throw new Boom('tagAll only works in groups (@g.us)', { statusCode: 400 });
    }
};
export const tagAll = async (sock, jid, text = '', options = {}) => {
    assertGroupSock(sock, jid);
    const meta = await sock.groupMetadata(jid);
    return sock.sendMessage(jid, buildTagContent(meta.participants, text), options);
};
export const hideTag = async (sock, jid, text = '', options = {}) => {
    assertGroupSock(sock, jid);
    const meta = await sock.groupMetadata(jid);
    return sock.sendMessage(jid, buildTagContent(meta.participants, text, { hide: true }), options);
};
