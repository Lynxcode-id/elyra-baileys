

const extractEditedContent = (updateEntry) => updateEntry?.update?.message?.editedMessage?.message || null;

export const bindPaymentGuard = (sock, hooks) => {
    const {
        isPaymentMessage,
        recordEnvelope = () => {},
        onDetect = () => {},
        treatDecryptFailureAsSuspicious = true,
    } = hooks || {};

    if (typeof isPaymentMessage !== 'function') {
        throw new Error('bindPaymentGuard: hooks.isPaymentMessage é obrigatório');
    }

    const onUpsert = ({ messages }) => {
        for (const webMessage of messages || []) {
            const remoteJid = webMessage?.key?.remoteJid;
            if (!remoteJid?.endsWith('@g.us')) continue;

            const isPayment = isPaymentMessage(webMessage);
            recordEnvelope(webMessage, isPayment);

            if (isPayment) {
                onDetect({
                    type: 'direct',
                    remoteJid,
                    participant: webMessage.key?.participant,
                    messageId: webMessage.key?.id,
                });
            }
        }
    };

    const onUpdate = (updates) => {
        for (const u of updates || []) {
            const editedContent = extractEditedContent(u);
            if (!editedContent) continue;

            const remoteJid = u.key?.remoteJid;
            if (!remoteJid?.endsWith('@g.us')) continue;

            const syntheticWebMessage = { message: editedContent, key: u.key };
            const isPayment = isPaymentMessage(syntheticWebMessage);
            recordEnvelope(syntheticWebMessage, isPayment);

            if (isPayment) {
                onDetect({
                    type: 'edited',
                    remoteJid,
                    participant: u.key?.participant,
                    messageId: u.key?.id,
                });
            }
        }
    };

    const onDecryptFailed = (failInfo) => {
        const remoteJid = failInfo?.remoteJid;
        if (!remoteJid?.endsWith('@g.us')) return;

        recordEnvelope(
            { key: { remoteJid, id: failInfo.messageId, participant: failInfo.participant }, message: null },
            false
        );

        if (treatDecryptFailureAsSuspicious) {
            onDetect({
                type: 'undecryptable',
                remoteJid,
                participant: failInfo.participant,
                messageId: failInfo.messageId,
                isPreKeyError: failInfo.isPreKeyError,
                errorMessage: failInfo.errorMessage,
            });
        }
    };

    sock.ev.on('messages.upsert', onUpsert);
    sock.ev.on('messages.update', onUpdate);
    sock.ev.on('messages.decrypt-failed', onDecryptFailed);

    return function unbindPaymentGuard() {
        sock.ev.off('messages.upsert', onUpsert);
        sock.ev.off('messages.update', onUpdate);
        sock.ev.off('messages.decrypt-failed', onDecryptFailed);
    };
};
