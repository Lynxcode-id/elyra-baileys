const MENTION_RE = /(?<![\w.])@(\d{5,20})(?![\w]|\.\w)/g;
const INVITE_RE = /(?:https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{16,32})/;
export const parseMentions = (text) => {
    if (typeof text !== 'string' || !text) {
        return [];
    }
    const seen = new Set();
    const out = [];
    for (const m of text.matchAll(MENTION_RE)) {
        const jid = `${m[1]}@s.whatsapp.net`;
        if (!seen.has(jid)) {
            seen.add(jid);
            out.push(jid);
        }
    }
    return out;
};
export const extractGroupInviteCode = (link) => {
    if (typeof link !== 'string' || !link) {
        return null;
    }
    const m = link.match(INVITE_RE);
    return m ? m[1] : null;
};
export const joinGroupViaLink = async (sock, linkOrCode) => {
    const code = extractGroupInviteCode(linkOrCode) ?? (/^[0-9A-Za-z]{16,32}$/.test(String(linkOrCode ?? '')) ? String(linkOrCode) : null);
    if (!code) {
        throw new Error(`joinGroupViaLink: no invite code found in ${JSON.stringify(linkOrCode)}`);
    }
    return sock.groupAcceptInvite(code);
};
