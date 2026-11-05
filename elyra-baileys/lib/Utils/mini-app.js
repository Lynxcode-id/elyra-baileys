import { Boom } from '@hapi/boom';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { fetchWithTimeout } from './fetch-timeout.js';
export const MINI_APP_DEFAULT_BUTTON_TEXT = '🚀 Open App';
const MAX_THUMBNAIL_BYTES = 512 * 1024;
const resolveThumbnail = async (thumbnail) => {
    if (!thumbnail) {
        return undefined;
    }
    if (Buffer.isBuffer(thumbnail)) {
        return thumbnail;
    }
    if (typeof thumbnail === 'string') {
        let res;
        try {
            res = await fetchWithTimeout(thumbnail);
        }
        catch (err) {
            throw new Boom(`miniApp.thumbnail: failed to fetch ${thumbnail} (${err?.message || err})`, { statusCode: 400 });
        }
        if (!res.ok) {
            throw new Boom(`miniApp.thumbnail: fetch failed with HTTP ${res.status}`, { statusCode: 400 });
        }
        const buf = Buffer.from(await res.arrayBuffer());
        if (!buf.length || buf.length > MAX_THUMBNAIL_BYTES) {
            throw new Boom(`miniApp.thumbnail: must be 1–${MAX_THUMBNAIL_BYTES} bytes`, { statusCode: 400 });
        }
        return buf;
    }
    throw new Boom('miniApp.thumbnail must be a Buffer or a URL string', { statusCode: 400 });
};
const normalizeFlowConfig = (flow) => {
    if (!flow) {
        return undefined;
    }
    const cfg = typeof flow === 'string' ? { id: flow } : flow;
    if (!cfg || typeof cfg !== 'object' || !cfg.id || typeof cfg.id !== 'string') {
        throw new Boom('miniApp.flow.id is required (your published WhatsApp Flow ID)', { statusCode: 400 });
    }
    return cfg;
};
const appendUrlParams = (link, params) => {
    if (!params || typeof params !== 'object' || !Object.keys(params).length) {
        return link;
    }
    let u;
    try {
        u = new URL(link);
    }
    catch {
        throw new Boom(`miniApp.url is not a valid URL: ${link}`, { statusCode: 400 });
    }
    for (const [k, v] of Object.entries(params)) {
        u.searchParams.set(k, String(v));
    }
    return u.toString();
};
export const buildMiniAppContent = async ({ title, body, text, url, appUrl, flow, params, buttonText, buttons = [], footer, thumbnail, useWebview = true, onThumbnailError, ...passthrough } = {}) => {
    const link = url || appUrl;
    const flowCfg = normalizeFlowConfig(flow);
    if ((!link || typeof link !== 'string') && !flowCfg) {
        throw new Boom('miniApp needs either `url` (webview app) or `flow` (WhatsApp Flow) — or both', { statusCode: 400 });
    }
    const mainText = body || text;
    if (!mainText || typeof mainText !== 'string') {
        throw new Boom('miniApp.body (or text) is required', { statusCode: 400 });
    }
    const finalUrl = link ? appendUrlParams(link, params) : undefined;
    let thumb;
    try {
        thumb = await resolveThumbnail(thumbnail);
    }
    catch (err) {
        if (typeof onThumbnailError === 'function') {
            try {
                onThumbnailError(err);
            }
            catch { }
        }
    }
    const cardTitle = title || 'Mini App';
    const nativeFlow = [
        ...(finalUrl ? [{ buttonText: buttonText || MINI_APP_DEFAULT_BUTTON_TEXT, url: finalUrl, useWebview }] : []),
        ...(flowCfg ? [{ buttonText: flowCfg.cta || '📝 Open', flow: flowCfg }] : []),
        ...buttons
    ];
    const content = {
        text: mainText,
        footer: footer ?? cardTitle,
        nativeFlow,
        ...passthrough
    };
    if (finalUrl) {
        const externalAdReply = {
            title: cardTitle,
            body: mainText.slice(0, 120),
            url: finalUrl,
            mediaType: 1,
            largeThumbnail: !!thumb
        };
        if (thumb) {
            externalAdReply.thumbnail = thumb;
        }
        content.externalAdReply = content.externalAdReply || externalAdReply;
    }
    return content;
};
export const sendMiniApp = async (sock, jid, miniApp, options = {}) => {
    if (!sock || typeof sock.sendMessage !== 'function') {
        throw new Boom('sendMiniApp(sock, ...) requires an active Baileys socket', { statusCode: 400 });
    }
    return sock.sendMessage(jid, await buildMiniAppContent(miniApp), options);
};

export const createMiniAppLink = (baseUrl, params = {}, { secret } = {}) => {
    let u;
    try {
        u = new URL(baseUrl);
    }
    catch {
        throw new Boom(`miniApp.url is not a valid URL: ${baseUrl}`, { statusCode: 400 });
    }
    for (const [k, v] of Object.entries(params || {})) {
        u.searchParams.set(k, String(v));
    }
    if (secret) {
        const payload = [...u.searchParams.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
        u.searchParams.set('sig', createHmac('sha256', secret).update(payload).digest('hex'));
    }
    return u.toString();
};

export const parseMiniAppParams = (link, { secret } = {}) => {
    let u;
    try {
        u = new URL(link);
    }
    catch {
        throw new Boom(`miniApp.url is not a valid URL: ${link}`, { statusCode: 400 });
    }
    const out = {};
    for (const [k, v] of u.searchParams.entries()) {
        if (k !== 'sig') {
            out[k] = v;
        }
    }
    if (secret) {
        const sig = u.searchParams.get('sig') || '';
        const payload = Object.entries(out).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
        const expect = createHmac('sha256', secret).update(payload).digest('hex');
        const ok = sig.length === expect.length && (() => { try { return timingSafeEqual(Buffer.from(sig), Buffer.from(expect)); } catch { return false; } })();
        if (!ok) {
            throw new Boom('miniApp.params: invalid signature', { statusCode: 403 });
        }
    }
    return out;
};

export const buildFlowDataExchange = (action, data = {}, { version = '3.0', token } = {}) => {
    if (!action || typeof action !== 'string') {
        throw new Boom('flow action is required (e.g. navigate, data_exchange)', { statusCode: 400 });
    }
    return { version, action, data, ...(token ? { token } : {}) };
};
