export const printQRIfNecessaryListener = (ev, logger) => {
    const listener = async ({ qr }) => {
        if (!qr)
            return;
        try {
            const mod = await import('qrcode-terminal');
            const QR = mod.default || mod;
            QR.generate(qr, { small: true });
        }
        catch (error) {
            logger?.error?.({ error: error?.message }, 'qrcode-terminal is not installed - run: npm install qrcode-terminal');
        }
    };
    ev.on('connection.update', listener);
    return () => ev.off('connection.update', listener);
};
