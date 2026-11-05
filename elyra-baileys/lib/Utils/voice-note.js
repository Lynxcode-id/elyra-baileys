import { Boom } from '@hapi/boom';
import { getStream, toBuffer } from './messages-media.js';
export const MAX_VOICE_NOTE_BYTES = 64 * 1024 * 1024;
export const isOggBuffer = (buf) => Buffer.isBuffer(buf) && buf.length > 4 && buf.subarray(0, 4).toString('latin1') === 'OggS';
const resolveAudioBuffer = async (audio) => {
    if (Buffer.isBuffer(audio)) {
        return audio;
    }
    if (audio == null || (typeof audio !== 'string' && typeof audio !== 'object')) {
        throw new Boom('voice note audio must be a Buffer, a file path, a URL, { url } or a stream', { statusCode: 400 });
    }
    const input = typeof audio === 'string' ? { url: audio } : audio;
    let buf;
    try {
        const { stream } = await getStream(input, { maxContentLength: MAX_VOICE_NOTE_BYTES });
        buf = await toBuffer(stream);
    }
    catch (err) {
        throw new Boom(`voice note: cannot read audio (${err?.message || err})`, { statusCode: 400 });
    }
    if (buf.length > MAX_VOICE_NOTE_BYTES) {
        throw new Boom(`voice note: audio exceeds ${MAX_VOICE_NOTE_BYTES} bytes`, { statusCode: 413 });
    }
    return buf;
};
export const buildVoiceNoteContent = async (audio, { convert = true, waveform, seconds, ...passthrough } = {}) => {
    let buf = await resolveAudioBuffer(audio);
    if (convert && !isOggBuffer(buf)) {
        const { MediaManager } = await import('../Framework/MediaManager.js');
        buf = await MediaManager.convertToVoiceNote(buf);
    }
    return { audio: buf, ptt: true, mimetype: 'audio/ogg; codecs=opus', waveform, seconds, ...passthrough };
};
export const sendVoiceNote = async (sock, jid, audio, { convert, waveform, seconds, ...sendOptions } = {}) => {
    if (!sock || typeof sock.sendMessage !== 'function') {
        throw new Boom('sendVoiceNote(sock, ...) requires an active Baileys socket', { statusCode: 400 });
    }
    return sock.sendMessage(jid, await buildVoiceNoteContent(audio, { convert, waveform, seconds }), sendOptions);
};
