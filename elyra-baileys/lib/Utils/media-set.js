import { randomBytes } from 'node:crypto';
import { generateWAMessageContent, generateWAMessageFromContent } from './messages.js';
import { unixTimestampSeconds } from './generics.js';
import { S_WHATSAPP_NET } from '../WABinary/index.js';
import { generatePP, generateProfilePictureFP } from './media-messages.js';
export const updateProfilePictureFull = async (jid, content, sock) => {
    const { query } = sock;
    const { img } = await generateProfilePictureFP(content);
    const media = await query({
        tag: 'iq',
        attrs: {
            target: jid,
            to: S_WHATSAPP_NET,
            type: 'set',
            xmlns: 'w:profile:picture'
        },
        content: [
            {
                tag: 'picture',
                attrs: { type: 'image' },
                content: img
            }
        ]
    });
    return media;
};
export const updateProfilePictureFull2 = async (jid, content, sock) => {
    const { query } = sock;
    const { preview } = await generatePP(content);
    const media = await query({
        tag: 'iq',
        attrs: {
            target: jid,
            to: S_WHATSAPP_NET,
            type: 'set',
            xmlns: 'w:profile:picture'
        },
        content: [
            {
                tag: 'picture',
                attrs: { type: 'image' },
                content: preview
            }
        ]
    });
    return media;
};
export const groupStatus = async (jid, content, sock) => {
    const { backgroundColor, ...rest } = content;
    const inside = await generateWAMessageContent(rest, {
        upload: sock.waUploadToServer,
        backgroundColor
    });
    const messageSecret = randomBytes(32);
    const userJid = sock.authState?.creds?.me?.id;
    const userJidLid = sock.authState?.creds?.me?.lid;
    const m = generateWAMessageFromContent(jid, {
        messageContextInfo: { messageSecret },
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: { messageSecret }
            }
        }
    }, { userJid, userJidLid });
    await sock.relayMessage(jid, m.message, { messageId: m.key.id });
    return m;
};
export const groupStatusV2 = async (jids, content, sock) => {
    const { backgroundColor, ...rest } = content;
    const inside = await generateWAMessageContent(rest, {
        upload: sock.waUploadToServer,
        backgroundColor
    });
    const messageSecret = randomBytes(32);
    const userJid = sock.authState?.creds?.me?.id;
    const userJidLid = sock.authState?.creds?.me?.lid;
    const results = [];
    for (const id of jids) {
        const m = generateWAMessageFromContent(id, {
            messageContextInfo: { messageSecret },
            groupStatusMessageV2: {
                message: {
                    ...inside,
                    messageContextInfo: { messageSecret }
                }
            }
        }, { userJid, userJidLid });
        await sock.relayMessage(id, m.message, { messageId: m.key.id });
        results.push(m);
    }
    return results;
};
export const groupSetMemberLabel = async (jid, memberLabel, sock) => {
    const result = await sock.relayMessage(jid, {
        protocolMessage: {
            type: 30,
            memberLabel: {
                label: memberLabel.slice(0, 30),
                labelTimestamp: unixTimestampSeconds() || Date.now()
            }
        }
    }, {
        additionalNodes: [
            {
                tag: 'meta',
                attrs: {
                    tag_reason: 'user_update',
                    appdata: 'member_tag'
                },
                content: undefined
            }
        ]
    });
    return result;
};
export const groupLabel = async (jid, text, sock) => {
    try {
        void sock.relayMessage(jid, {
            protocolMessage: {
                type: 30,
                memberLabel: {
                    label: text.slice(0, 30),
                    labelTimestamp: unixTimestampSeconds() || Date.now()
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: 'meta',
                    attrs: {
                        tag_reason: 'user_update',
                        appdata: 'member_tag'
                    },
                    content: undefined
                }
            ]
        });
    }
    catch {
    }
};
