import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const pkg = (() => {
    try {
        const pkgPath = fileURLToPath(new URL('./package.json', import.meta.url));
        return JSON.parse(readFileSync(pkgPath, 'utf8'));
    } catch {
        return {};
    }
})();

// Pink gradient stops (24-bit RGB): hot pink -> soft pink -> light orchid
const STOPS = [
    [255, 64, 150],
    [255, 105, 180],
    [255, 150, 200],
    [255, 190, 225]
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

const colorAt = (t) => {
    const x = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1);
    const i = Math.min(Math.floor(x), STOPS.length - 2);
    const f = x - i;
    return STOPS[i].map((v, k) => lerp(v, STOPS[i + 1][k], f));
};

const RULE = '─'.repeat(32);

const INFO = [
    ['Developer', 'Lynx Decode'],
    ['Identity', 'Arman'],
    ['Main Lab', 'Elyra Labs'],
    ['Development', "INF Project's Labs"],
    ['Dedicated For', 'ERINE-AI'],
    ['Original Fork', 'Itsliaaa/baileys'],
    ['Fork Identity', 'Ourin Baileys']
];

const LABEL_WIDTH = Math.max(...INFO.map(([k]) => k.length));

export function getBannerLines() {
    return [
        'ELYRA BAILEYS  /  OFFICIAL EDITION',
        RULE,
        '',
        ...INFO.map(([k, v], i) => `[${String(i + 1).padStart(2, '0')}] ${k.padEnd(LABEL_WIDTH)} : ${v}`),
        '',
        'Thank you for choosing Elyra Baileys.',
        'Your support keeps our development moving forward.',
        '',
        RULE,
        'DESIGNED EXCLUSIVELY FOR ERINE-AI',
        'POWERED BY ELYRA LABS',
        '© 2026 Elyra Labs'
    ];
}

export function printBanner() {
    if (process.env.ELYRA_BANNER === '0') return;
    if (globalThis.__ElyraBannerShown) return;
    globalThis.__ElyraBannerShown = true;

    const lines = getBannerLines();

    const fancy = (Boolean(process.stdout.isTTY) || process.env.FORCE_COLOR !== undefined) && process.env.NO_COLOR === undefined;
    if (!fancy) {
        console.log('\n' + lines.join('\n') + '\n');
        return;
    }

    const reset = '\x1b[0m';
    const paint = (text, from, to, style = '') => {
        const chars = [...text];
        const last = Math.max(chars.length - 1, 1);
        return style + chars.map((ch, i) => {
            const [r, g, b] = colorAt(from + ((to - from) * i) / last);
            return `\x1b[38;2;${r};${g};${b}m${ch}`;
        }).join('') + reset;
    };

    // Vertical gradient (hot pink at the top -> soft pink at the bottom) combined with a horizontal sweep per line.
    const total = lines.length;
    const out = lines.map((line, i) => {
        if (!line) return '';
        const t = i / Math.max(total - 1, 1);
        const style = i === 0 ? '\x1b[1m' : '';
        return paint(line, Math.min(t, 0.7), Math.min(t + 0.3, 1), style);
    });

    console.log('\n' + out.join('\n') + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) printBanner();
