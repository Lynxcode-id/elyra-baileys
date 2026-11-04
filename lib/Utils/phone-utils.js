export const validateE164 = (raw) => {
    if (typeof raw !== 'string') {
        throw new TypeError(`Invalid E.164 number: ${String(raw)}`);
    }
    let num = raw.trim();
    if (num.startsWith('+')) {
        num = num.slice(1);
    }
    if (!/^[1-9][0-9]{6,14}$/.test(num)) {
        throw new Error(`Invalid E.164 number: ${raw}`);
    }
    return `+${num}`;
};
export const jidToPhone = (jid) => {
    const match = typeof jid === 'string' ? jid.match(/^(\d+)(?::\d+)?@(?:s\.whatsapp\.net|c\.us)$/) : null;
    return match ? match[1] : '';
};
export const phoneToJid = (phone, isGroup = false) => {
    const digits = String(phone ?? '').replace(/[^0-9]/g, '');
    if (!digits) {
        throw new Error(`Cannot build a JID from "${phone}"`);
    }
    return `${digits}@${isGroup ? 'g.us' : 's.whatsapp.net'}`;
};
