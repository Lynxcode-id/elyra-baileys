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

export function printBanner() {
    if (process.env.ELYRA_BANNER === '0') return;
    if (globalThis.__ElyraBannerShown) return;
    globalThis.__ElyraBannerShown = true;

    const version = pkg.version ? ` v${pkg.version}` : '';
    const lines = [
        `Thanks for using my baileys`,
        `elyra-baileys${version} disempurnahkan untuk erine-ai`,
        `fork by itsliaaa/baileys`,
        `by lynx decode`
    ];

    const fancy = (Boolean(process.stdout.isTTY) || process.env.FORCE_COLOR !== undefined) && process.env.NO_COLOR === undefined;
    if (!fancy) {
        console.log('\n' + lines.join('\n') + '\n');
        return;
    }

    const reset = '\x1b[0m';
    const paint = (text, from = 0, to = 1, style = '') => {
        const chars = [...text];
        const last = Math.max(chars.length - 1, 1);
        return style + chars.map((ch, i) => {
            const [r, g, b] = colorAt(from + ((to - from) * i) / last);
            return `\x1b[38;2;${r};${g};${b}m${ch}`;
        }).join('') + reset;
    };

    const out = [
        '',
        paint(lines[0], 0, 1, '\x1b[1m'),
        paint(lines[1], 0, 1),
        paint(lines[2], 0.15, 0.85),
        paint(lines[3], 0.3, 1, '\x1b[3m'),
        ''
    ];
    console.log(out.join('\n'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) printBanner();
