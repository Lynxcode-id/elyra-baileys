export const DEFAULT_TEXT_PART_LENGTH = 4000;
export const splitText = (text, maxLen = DEFAULT_TEXT_PART_LENGTH) => {
    const limit = Number.isFinite(maxLen) && maxLen >= 2 ? Math.floor(maxLen) : DEFAULT_TEXT_PART_LENGTH;
    const out = [];
    let rest = String(text ?? '');
    while (rest.length > limit) {
        let cut = rest.lastIndexOf('\n', limit);
        if (cut < limit * 0.5) {
            cut = rest.lastIndexOf(' ', limit);
        }
        if (cut < limit * 0.5) {
            cut = limit;
            const prev = rest.charCodeAt(cut - 1);
            if (prev >= 0xd800 && prev <= 0xdbff) {
                cut -= 1;
            }
        }
        out.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
    }
    if (rest) {
        out.push(rest);
    }
    return out.filter(Boolean);
};
export const whatsappify = (text) => {
    if (typeof text !== 'string' || !text) {
        return text;
    }
    const stash = [];
    const hold = (m) => `\u0000${stash.push(m) - 1}\u0000`;
    let t = text.replace(/```[\s\S]*?```/g, hold).replace(/`[^`\n]+`/g, hold);
    for (let i = 0; i < 3; i++) {
        t = t.replace(/\*\*\*([^*\n]+)\*\*\*/g, '*$1*');
        t = t.replace(/\*\*([^*\n]+)\*\*/g, '*$1*');
        t = t.replace(/__([^_\n]+)__/g, '*$1*');
    }
    t = t.replace(/_{2,}([^_\n]+)_{2,}/g, '_$1_');
    t = t.replace(/~~([^~\n]+)~~/g, '~$1~');
    t = t.replace(/^\s{0,3}#{1,6}\s+/gm, '');
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1 ($2)');
    t = t.replace(/\*{3,}/g, '*').replace(/_{3,}/g, '_');
    t = t.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);
    return t.trim();
};
export const sendLongText = async (sock, jid, text, { quoted, format = true, maxLen = DEFAULT_TEXT_PART_LENGTH, delayMs = 250 } = {}) => {
    if (!sock || typeof sock.sendMessage !== 'function') {
        throw new TypeError('sendLongText(sock, ...) requires a socket with sendMessage');
    }
    const body = format ? whatsappify(String(text ?? '')) : String(text ?? '');
    const parts = splitText(body, maxLen);
    const ids = [];
    for (let i = 0; i < parts.length; i++) {
        try {
            const result = await sock.sendMessage(jid, { text: parts[i] }, quoted ? { quoted } : undefined);
            if (result?.key?.id) {
                ids.push(result.key.id);
            }
        }
        catch (error) {
            return { ok: false, ids, error };
        }
        if (delayMs > 0 && i < parts.length - 1) {
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }
    return { ok: true, ids };
};
