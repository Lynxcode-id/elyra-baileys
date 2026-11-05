export const DISAPPEARING_DURATIONS = {
    OFF: 0,
    HOURS_24: 86400,
    DAYS_7: 604800,
    DAYS_90: 7776000
};
export class TypingIndicator {
    constructor(sendPresence) {
        this.sendPresence = sendPresence;
        this.timers = new Map();
    }
    async startTyping(jid, options = {}) {
        this.clearTimer(jid);
        await this.sendPresence(jid, 'composing');
        if (options.autoPause !== false && options.duration) {
            const t = setTimeout(() => void this.stopTyping(jid), options.duration);
            this.timers.set(jid, t);
        }
    }
    async startRecording(jid, options = {}) {
        this.clearTimer(jid);
        await this.sendPresence(jid, 'recording');
        if (options.autoPause !== false && options.duration) {
            const t = setTimeout(() => void this.stopTyping(jid), options.duration);
            this.timers.set(jid, t);
        }
    }
    async stopTyping(jid) {
        this.clearTimer(jid);
        try {
            await this.sendPresence(jid, 'paused');
        }
        catch {
        }
    }
    async stopAll() {
        const jids = Array.from(this.timers.keys());
        await Promise.all(jids.map(jid => this.stopTyping(jid)));
    }
    async simulateTyping(jid, durationMs, callback) {
        await this.startTyping(jid);
        await new Promise(resolve => setTimeout(resolve, durationMs));
        await this.stopTyping(jid);
        return callback();
    }
    clearTimer(jid) {
        const existing = this.timers.get(jid);
        if (existing) {
            clearTimeout(existing);
            this.timers.delete(jid);
        }
    }
}
export const createTypingIndicator = (sendPresence) => new TypingIndicator(sendPresence);
export class PinnedMessagesManager {
    constructor() {
        this.store = new Map();
    }
    pin(jid, messageId, pinnedBy, expiresAt) {
        const entry = { messageId, jid, pinnedAt: new Date(), pinnedBy, expiresAt };
        const existing = this.store.get(jid) ?? [];
        const filtered = existing.filter(p => p.messageId !== messageId);
        filtered.push(entry);
        this.store.set(jid, filtered);
        return entry;
    }
    unpin(jid, messageId) {
        const existing = this.store.get(jid);
        if (!existing)
            return false;
        const filtered = existing.filter(p => p.messageId !== messageId);
        if (filtered.length === existing.length)
            return false;
        this.store.set(jid, filtered);
        return true;
    }
    getPinned(jid) {
        return this.store.get(jid) ?? [];
    }
    isPinned(jid, messageId) {
        return (this.store.get(jid) ?? []).some(p => p.messageId === messageId);
    }
    clearPins(jid) {
        this.store.delete(jid);
    }
    clearExpired() {
        let cleared = 0;
        const now = Date.now();
        for (const [jid, pins] of this.store) {
            const valid = pins.filter(p => !p.expiresAt || p.expiresAt.getTime() > now);
            cleared += pins.length - valid.length;
            this.store.set(jid, valid);
        }
        return cleared;
    }
    get totalPins() {
        let total = 0;
        for (const pins of this.store.values())
            total += pins.length;
        return total;
    }
}
export const createPinnedMessagesManager = () => new PinnedMessagesManager();
export const createReadReceiptController = (sendReadReceipt, config = {}) => {
    let currentConfig = {
        enabled: config.enabled ?? true,
        excludeJids: config.excludeJids ?? [],
        readDelay: config.readDelay ?? 0
    };
    return {
        setConfig(newConfig) {
            currentConfig = { ...currentConfig, ...newConfig };
        },
        getConfig() {
            return { ...currentConfig };
        },
        enable() {
            currentConfig.enabled = true;
        },
        disable() {
            currentConfig.enabled = false;
        },
        isEnabled() {
            return currentConfig.enabled;
        },
        async markRead(jid, participant, messageIds) {
            if (!currentConfig.enabled)
                return;
            if (currentConfig.excludeJids.includes(jid))
                return;
            if (currentConfig.readDelay > 0) {
                await new Promise(r => setTimeout(r, currentConfig.readDelay));
            }
            await sendReadReceipt(jid, participant, messageIds);
        },
        async forceMarkRead(jid, participant, messageIds) {
            await sendReadReceipt(jid, participant, messageIds);
        }
    };
};
