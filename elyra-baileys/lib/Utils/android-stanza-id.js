import { randomBytes } from 'node:crypto';

export const generateAndroidStanzaId = () => 'AC' + randomBytes(10).toString('hex').toUpperCase().slice(0, 19);

export const patchAndroidStanzaId = (sock, logger) => {
	if (!sock || sock._androidIdPatched) return sock;
	sock._androidIdPatched = true;
	const relay = sock.relayMessage.bind(sock);
	sock.relayMessage = (jid, message, options = {}) => relay(jid, message, options.messageId ? options : { ...options, messageId: generateAndroidStanzaId() });
	const send = sock.sendMessage.bind(sock);
	sock.sendMessage = (jid, content, options = {}) => send(jid, content, options.messageId ? options : { ...options, messageId: generateAndroidStanzaId() });
	logger?.success?.('[Android ID] sock.relayMessage + sock.sendMessage patched');
	return sock;
};
