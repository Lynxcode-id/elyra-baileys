<div align="center" id="top">

<img src="https://raw.githubusercontent.com/Lynxcode-id/picture/main/1792592910326.jpeg" width="160" alt="Elyra Baileys logo"/>

# elyra-baileys

ESM-only WhatsApp Web (multi-device) library untuk Node.js — interactive messages, native flow, AIRich, Bot framework, VoIP, dan banyak backend store.

[![npm](https://img.shields.io/npm/v/elyra-baileys?color=2ecc71&label=npm&style=for-the-badge)](https://www.npmjs.com/package/elyra-baileys)
[![downloads](https://img.shields.io/npm/dt/elyra-baileys?color=3498db&style=for-the-badge)](https://www.npmjs.com/package/elyra-baileys)
[![stars](https://img.shields.io/github/stars/Lynxcode-id/elyra-baileys?color=f1c40f&style=for-the-badge)](https://github.com/Lynxcode-id/elyra-baileys/stargazers)
[![issues](https://img.shields.io/github/issues/Lynxcode-id/elyra-baileys?color=e74c3c&style=for-the-badge)](https://github.com/Lynxcode-id/elyra-baileys/issues)

![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square)
![esm](https://img.shields.io/badge/module-ESM-blue?style=flat-square)
![types](https://img.shields.io/badge/types-included-blue?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)

[Install](#-install) · [Quick Start](#-quick-start) · [Auth](#-authentication) · [Store](#-store-backends) · [Contoh](#-contoh-pemakaian) · [Docs](docs/FEATURES.md) · [FAQ](#-faq--troubleshooting) · [Kontributor](#-kontributor--credits)

</div>

---

## 📖 Daftar Isi

- [🆕 Yang Baru (v1.1.0)](#-yang-baru-v110)
- [🍃 Kenapa Elyra Baileys?](#-kenapa-elyra-baileys)
- [🆚 Perbandingan](#-perbandingan)
- [🔥 Fitur](#-fitur)
- [📦 Install](#-install)
- [🚀 Quick Start](#-quick-start)
- [🔐 Authentication](#-authentication)
- [🗄️ Store Backends](#-store-backends)
- [💡 Contoh Pemakaian](#-contoh-pemakaian)
- [📞 Voice & Video Call](#-voice--video-call)
- [🔎 User Sync Queries](#-user-sync-queries)
- [👤 Username Management](#-username-management)
- [🤖 Bot Framework](#-bot-framework)
- [🧩 Utility Modules](#-utility-modules)
- [📘 TypeScript](#-typescript)
- [🛠 Environment yang Disarankan](#-environment-yang-disarankan)
- [📁 Struktur Package](#-struktur-package)
- [🆚 Perbedaan dengan Upstream](#-perbedaan-dengan-upstream)
- [📚 Fork Lineage](#-fork-lineage)
- [❓ FAQ & Troubleshooting](#-faq--troubleshooting)
- [🤝 Contributing](#-contributing)
- [🙏 Kontributor & Credits](#-kontributor--credits)
- [⚠️ Disclaimer](#️-disclaimer)
- [📄 License](#-license)

---

## 🆕 Yang Baru (v1.1.0)

Sinkronisasi dengan [`@itsliaaa/baileys`](https://github.com/itsliaaa/baileys) 0.4.3+.

### SQLite auth state
- **Driver otomatis:** `bun:sqlite` (Bun) → `node:sqlite` (Node ≥ 22.13) → `better-sqlite3`. Kalau runtime kamu sudah punya driver bawaan, tidak perlu install apa pun.
- Prepared statement sinkron, penulisan key dalam transaksi `BEGIN IMMEDIATE` dengan rollback otomatis.
- Schema `WITHOUT ROWID` + `busy_timeout`, `journal_mode = WAL`, `synchronous = NORMAL`. **Database lama tetap kompatibel.**
- `saveCreds()` tidak menulis ulang kalau creds tidak berubah.
- Signature fleksibel: path, path + koneksi sendiri, atau options object (`{ dbPath }` / `{ database }`).
- `keys.list()` / `keys.listIds()` diperbaiki (sebelumnya query tabel `keys` yang tidak ada).
- ⚠️ Prune otomatis `pre-key`/`session` dihapus karena bisa membuang sesi Signal yang masih aktif.

### WAProto
- **23 message baru**, **62 field baru** di 34 message existing, **10 enum baru**, dan **95 nilai enum baru**.
- Contoh: `Message.RequestLocationMessage`, `Message.RequestLocationUpdateMessage`, `Message.MusicMessage.Lyrics`, `MsgOpaqueData.MusicData`, `OmittedConversationMetadata`, `Message.instantImageMessage`, `ContextInfo.partnerDeepLinkToken`, `VideoMessage.smartThumbnailTs`, serta stub type & bot capability terbaru.
- Sifatnya **hanya menambah** — message khusus Elyra tetap utuh. Diverifikasi dengan 58 uji round-trip encode/decode silang, 0 gagal.
- `ChatSolidColorWallpaper` #1/#2 sengaja tidak diubah (bentrok tipe wire dengan skema lama Elyra) — detail di [docs](docs/FEATURES.md#-whats-new).

### Socket & media
- Versi WA Web default → `2.3000.1052983891`.
- Upload newsletter `video` / `gif` / `ptv` menambahkan `server_transcode=1`.
- Peta path upload & HKDF media diperluas (`gif`, `ptt`, `ptv`, `ppic`, `ads-image`, `ads-video`, `group-history`, `music-artwork`, `maiba-file`, dst.) tanpa menimpa entri Elyra yang sudah ada.

---

## 🍃 Kenapa Elyra Baileys?

| | |
|---|---|
| 🚀 | Developer experience yang lebih enak |
| 🎯 | Native flow yang diperluas |
| 📢 | Fitur status & broadcast lanjutan |
| 🧩 | Lebih banyak tipe interactive message |
| ⚡ | Implementasi bersih untuk developer bot |
| 🔧 | Utilitas ekstra yang tidak ada di fork Baileys standar |
| 🗄️ | Banyak backend auth & store siap pakai (file, SQLite, MongoDB, MySQL, PostgreSQL, Redis) |
| 📞 | Dukungan voice call (VoIP) eksperimental |

---

## 🆚 Perbandingan

| Kemampuan | `elyra-baileys` | `@itsliaaa/baileys` | `WhiskeySockets/Baileys` |
|---|:---:|:---:|:---:|
| Native Flow buttons (V1/V2/V3) | ✅ | ✅ | ⚠️ dasar saja |
| Carousel | ✅ | ❌ | ❌ |
| Rich response cards (AIRich) | ✅ | ❌ | ❌ |
| Commerce flow (catalog/order/payment) | ✅ | ⚠️ sebagian | ❌ |
| Voice calling (VoIP) | ✅ eksperimental | ❌ | ❌ |
| Multi-backend store (SQL/Mongo/Redis) | ✅ | ⚠️ file/SQLite saja | ⚠️ in-memory saja |
| SQLite auth multi-driver (Bun/Node/better-sqlite3) | ✅ | ✅ | ❌ |
| `.d.ts` TypeScript lengkap | ✅ | ⚠️ parsial | ⚠️ parsial |
| User sync queries (WAUSync) | ✅ | ✅ | ✅ |
| Username management | ✅ | ❌ | ❌ |
| Bot framework (middleware, session, stats) | ✅ | ❌ | ❌ |

> Tabel ini membandingkan fitur di level package, bukan benchmark performa. Koreksi dipersilakan lewat [Contributing](#-contributing).

---

## 🔥 Fitur

| 💬 Interactive Messages | 🛒 Commerce & Business | 🧩 Utility |
|---|---|---|
| Native Flow | Catalog Message | Group Status |
| Buttons V1 / V2 / V3 | Order Details / Status | Mention All |
| Lists | Review & Pay | Lottie Sticker |
| Carousel | Payment Status / Method | Newsletter |
| Poll & Quiz | Track / Reorder / Cancel Order | ExternalAdReply Helper |
| Rich Response (AIRich) | | View Once |
| CTA / Reply / URL / Call / OTP / Auth Buttons | | Rich Formatting & Code Highlighting |

| 🔐 Auth & Storage | 📞 Realtime | 🛠 Tooling |
|---|---|---|
| Multi-file auth | Voice call (VoIP, WASM) | `.d.ts` lengkap |
| Single-file auth | User sync (WAUSync) | Anti-delete |
| **SQLite auth (multi-driver)** | Presence / status / device lookup | Message search |
| Cache-manager auth | Event buffer untuk bot trafik tinggi | Auto-reply & scheduling |
| Encrypted auth (AES-256-GCM) | | Message retry manager |
| SQLite / MongoDB / MySQL / PostgreSQL / Redis store | | Mock socket untuk testing |

### Native Flow yang didukung

| Buttons & Actions | Commerce | Navigasi & Lainnya |
|---|---|---|
| `cta_reminder`, `cta_cancel_reminder` | `catalog_message`, `mpm`, `card_message` | `address_message`, `send_location` |
| `otp_button`, `authentication_button` | `order_details`, `order_status` | `track_order`, `reorder`, `cancel_order` |
| `call_button`, `voice_call`, `video_call_button` | `review_and_pay` | `clear_chat`, `navigateToScreen` |
| `url_button`, `reply_button` | `payment_status`, `payment_method` | `flow_action` |

### System Notification Filter

Setiap pesan punya flag `message.isSystemNotification` untuk menyaring notifikasi E2E, notice layanan Meta, dan pesan sistem lainnya.

---

## 📦 Install

```bash
npm install elyra-baileys
```

Langsung dari GitHub:

```bash
npm install github:Lynxcode-id/elyra-baileys
```

> Butuh **Node.js 20+** (dijaga lewat field `engines`).

### Peer dependency opsional

Semua **opsional** — socket tetap jalan tanpanya. Install hanya yang fiturnya kamu pakai; kalau kurang, error-nya memberi petunjuk install yang jelas.

| Package | Fungsi |
|---|---|
| `sharp` | Resize/proses gambar cepat (`Toolkit.resize`) |
| `@napi-rs/image` | Alternatif native yang lebih ringan dari `sharp` |
| `jimp` | Fallback gambar pure-JS |
| `fluent-ffmpeg` | Konversi audio/video untuk media message |
| `audio-decode` | Ekstraksi waveform/durasi audio (voice note, VoIP) |
| `link-preview-js` | Link preview untuk URL di teks keluar |
| `better-sqlite3` | Store adapter SQLite & `SQLiteStore`/`StatsManager` Bot Framework. Untuk `useSqliteAuthState` hanya perlu kalau runtime tidak punya driver bawaan (`bun:sqlite` / `node:sqlite`) |
| `node-webpmux` | Metadata EXIF packname/author pada sticker |
| `mongodb` · `mysql2` · `pg` · `ioredis` | Store adapter MongoDB / MySQL / PostgreSQL / Redis |
| `@roamhq/wrtc` | WebRTC native untuk [voice call](#-voice--video-call) |
| `qrcode-terminal` | Render QR di terminal |
| `ffmpeg-static` / `@ffmpeg-installer/ffmpeg` | Binary ffmpeg bawaan |
| `axios` | HTTP helper opsional |

---

## 🚀 Quick Start

```js
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'elyra-baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')
const sock = makeWASocket({ auth: state })

sock.ev.on('creds.update', saveCreds)

sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
  // printQRInTerminal sudah deprecated di upstream — render QR sendiri,
  // mis. dengan `qrcode-terminal`:  qrcode.generate(qr, { small: true })
  if (qr) console.log('Scan QR ini:', qr)
  if (connection === 'open') console.log('🍃 Connected!')
  if (connection === 'close') console.log('closed', lastDisconnect?.error)
})

sock.ev.on('messages.upsert', ({ messages }) => {
  const msg = messages[0]
  if (!msg.message || msg.key.fromMe) return
  console.log('Pesan baru dari', msg.key.remoteJid)
})
```

---

## 🔐 Authentication

Semua backend mengembalikan bentuk `{ state, saveCreds }` yang sama, jadi bisa saling menggantikan.

| Fungsi | Penyimpanan | Cocok untuk |
|---|---|---|
| `useMultiFileAuthState(folder)` | Satu file JSON per key | Pilihan default — simpel & mudah di-debug |
| `useSingleFileAuthState(fileName)` | Satu file JSON | Bot kecil yang gampang di-backup |
| `useSqliteAuthState(pathOrOpts)` | SQLite (`bun:sqlite` / `node:sqlite` / `better-sqlite3`, otomatis) | Auth dalam satu file DB; bot yang sudah pakai SQLite |
| `useCacheManagerAuthState(store, sessionKey)` | Store kompatibel [`cacheable`](https://www.npmjs.com/package/@cacheable/node-cache) | Hosting multi-session, setup berbasis Redis |
| `useEncryptedFileAuthState(folder, { password })` | File terenkripsi AES-256-GCM | Auth at-rest yang lebih aman |

### SQLite

```js
import makeWASocket, { useSqliteAuthState } from 'elyra-baileys'

const { state, saveCreds, close } = await useSqliteAuthState('./auth.db')
const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)

// saat shutdown
close()
```

Semua gaya pemanggilan yang diterima:

```js
await useSqliteAuthState('./auth.db')                         // path
await useSqliteAuthState('./auth.db', existingDb)             // pakai koneksi sendiri (tidak ditutup oleh close())
await useSqliteAuthState({ dbPath: './auth.db' })             // options object
await useSqliteAuthState({ database: './auth.db' })           // `database` boleh path...
await useSqliteAuthState({ database: existingDb })            // ...atau koneksi terbuka
await useSqliteAuthState({ dbPath: './auth.db', walCheckpointIntervalMs: 0 }) // matikan timer checkpoint WAL
```

- Urutan driver: **`bun:sqlite` → `node:sqlite` → `better-sqlite3`**. Di Node < 22.13 tanpa Bun, jalankan `npm i better-sqlite3`.
- Memigrasi sesi lama ke SQLite: `migrateAuthState({ from, to })`.
- `useMultiFileAuthState` juga mengekspor `pruneStaleAuthFiles(folder, options)` untuk membersihkan sender-key lama secara berkala.

### Stability & security

```js
import makeWASocket, { autoReconnect, useEncryptedFileAuthState, sendHumanized } from 'elyra-baileys'

// creds + keys terenkripsi di disk (folder plaintext lama dibaca & dimigrasi saat save berikutnya)
const { state, saveCreds } = await useEncryptedFileAuthState('./auth', { password: process.env.AUTH_PASSWORD })

const manager = autoReconnect(() => makeWASocket({ auth: state }), {
  onSocket: (sock) => {
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
      await sendHumanized(sock, messages[0].key.remoteJid, { text: 'pong' })
    })
  },
  onLoggedOut: () => console.log('sesi logout — hapus ./auth lalu pairing ulang'),
})
await manager.start()
```

---

## 🗄️ Store Backends

`makeInMemoryStore()` memberi cache chat/contact/message klasik di memori. Untuk data yang harus bertahan setelah restart, `makePersistentStore()` membungkus salah satu dari lima backend dengan interface yang sama:

| Backend | Fungsi |
|---|---|
| SQLite | `createSqliteStoreAdapter(opts)` |
| MongoDB | `createMongoStoreAdapter(opts)` |
| MySQL | `createMysqlStoreAdapter(opts)` |
| PostgreSQL | `createPostgresStoreAdapter(opts)` |
| Redis | `createRedisStoreAdapter(opts)` |

```js
import makeWASocket, { makeInMemoryStore } from 'elyra-baileys'

const store = makeInMemoryStore({})
store.readFromFile('./baileys_store.json')
setInterval(() => store.writeToFile('./baileys_store.json'), 10_000)

const sock = makeWASocket({ /* auth dll. */ })
store.bind(sock.ev)
```

---

## 💡 Contoh Pemakaian

### Buttons & Native Flow

```js
import { Button } from 'elyra-baileys'

await new Button(sock)
  .setTitle('Promo Spesial')
  .setBody('Diskon 20% cuma hari ini')
  .setFooter('elyra-baileys')
  .addReply('Klaim Sekarang', 'claim_promo')
  .addUrl('Lihat Katalog', 'https://example.com/catalog')
  .addCall('Hubungi Kami', '628123456789')
  .send(jid)
```

### Poll

```js
import { Poll } from 'elyra-baileys'

await new Poll(sock)
  .setName('Mau makan apa hari ini?')
  .addOptions(['Nasi Goreng', 'Mie Ayam', 'Bakso'])
  .setSelectable(1)
  .send(jid)
```

### Carousel

> Tiap card harus dibuat dengan `Button(...).toCard()` dulu — card carousel pada dasarnya adalah button card dengan header gambar/video.

```js
import { Button, Carousel } from 'elyra-baileys'

const cardA = await new Button(sock)
  .setImage('https://example.com/a.jpg')
  .setTitle('Produk A')
  .addUrl('Lihat', 'https://example.com/a')
  .toCard()

const cardB = await new Button(sock)
  .setImage('https://example.com/b.jpg')
  .setTitle('Produk B')
  .addUrl('Lihat', 'https://example.com/b')
  .toCard()

await new Carousel(sock)
  .setBody('Pilih salah satu produk di bawah ini')
  .addCard([cardA, cardB])
  .send(jid)
```

### AIRich — rich response cards

```js
import { AIRich } from 'elyra-baileys'

await new AIRich(sock)
  .addHeading('Ringkasan Order')
  .addText('Pesananmu sedang diproses.')
  .addTable([
    ['Item', 'Qty'],
    ['Kopi Susu', '2']
  ])
  .addTip('Pesanan biasanya siap dalam 15 menit')
  .addSuggest('Lacak Order')
  .send(jid)
```

Setiap `add*()`/`set*()` pada `AIRich` menerima `{ id, insertAt }` sehingga blok bisa disisipkan relatif terhadap blok sebelumnya (berguna untuk respons bergaya streaming / edit-in-place). Builder lain: **`ButtonV2`** (quick-reply sederhana), **`ButtonV3`** (`loadFrom(msg)` untuk mengedit template message), dan **`Toolkit`** (helper statis seperti `Toolkit.resize()`).

### Hub builder terpadu

```js
import { ElyraBaileys } from 'elyra-baileys'

const vx = new ElyraBaileys(sock)

await vx.button()
  .setTitle('Promo Spesial')
  .addReply('Klaim Sekarang', 'claim_promo')
  .send(jid)

await vx.poll()
  .setName('Mau makan apa hari ini?')
  .addOptions(['Nasi Goreng', 'Mie Ayam'])
  .send(jid)
```

### Peta folder `lib/Builders/`

| File | Export | Fungsi |
|---|---|---|
| `shared.js` | `Toolkit`, `BaseBuilder`, `RowBuilder` | Fondasi bersama semua builder |
| `Button.js` | `Button`, `CardBuilder` | Builder interactive/native-flow utama (header gambar/video/dokumen, CTA, `.toCard()`) |
| `ButtonV2.js` | `ButtonV2` | Varian ringan: quick-reply saja |
| `ButtonV3.js` | `ButtonV3` | `loadFrom(msg)` untuk edit template message |
| `Carousel.js` | `Carousel` | Carousel card (maks. `Carousel.MAX_CARDS` = 10) |
| `Poll.js` | `Poll` | Poll/vote: single/multi-select, hidden voter, jawaban benar, expiry |
| `AIRich.js` | `AIRich` (+ alias `ORich`, `AIElyra`, `LeafRich`, `ElyraAI`, `ElyraRich`, `RichElyra`) | Builder rich response ala asisten AI |
| `A2UI.js` | `A2UI`, `sendA2UIWidget` | Builder widget A2UI/Bloks level rendah |
| `ElyraBaileys.js` | `ElyraBaileys` | Hub yang membungkus semua builder |
| `index.js` | semua di atas + `MESSAGE_BUILDER_VERSION` | Barrel file |

---

## 📞 Voice & Video Call

Dukungan audio call eksperimental (port dari ourin-baileys) lewat WASM call stack + relay WebRTC. Butuh peer dependency opsional `@roamhq/wrtc`.

```js
import { VoipClient } from 'elyra-baileys'

const voip = new VoipClient({ resourcesPath: './voip-resources' })
await voip.connectWithSocket(sock)

const call = await voip.call('628123456789')

call.on('ringing', () => console.log('Ringing...'))
call.on('connected', () => console.log('Call connected'))
call.on('ended', (reason) => console.log('Call ended:', reason))
```

`ActiveCall` dan `CallState` juga diekspor langsung untuk kontrol state yang lebih detail.

---

## 🔎 User Sync Queries

`WAUSync` (`USyncQuery` / `USyncUser` + protocol) dipakai untuk cek registrasi WhatsApp, daftar device, status, dan info username sebelum mengirim pesan — mekanisme yang sama di balik `sock.onWhatsApp()`.

```js
import { USyncQuery, USyncUser, USyncContactProtocol } from 'elyra-baileys'

const query = new USyncQuery()
  .withContext('interactive')
  .withMode('query')
  .withUser(new USyncUser().withPhone('628123456789'))

query.protocols.push(new USyncContactProtocol())

const result = await sock.executeUSyncQuery(query)
```

Protocol tersedia: `USyncContactProtocol`, `USyncDeviceProtocol`, `USyncStatusProtocol`, `USyncUsernameProtocol`, `USyncDisappearingModeProtocol`, `UsyncBotProfileProtocol`, `UsyncLIDProtocol`, serta `USyncBusinessProtocol`, `USyncPictureProtocol`, `USyncTextStatusProtocol`, `USyncSidelistProtocol`, `USyncFeatureProtocol` (dengan helper chainable di `USyncQuery`):

```js
const query = new USyncQuery()
  .withContext('interactive')
  .withMode('query')
  .withUser(new USyncUser().withId('628123456789@s.whatsapp.net'))
  .withBusinessProtocol()      // -> { verifiedName, verifiedLevel, profileTag, pnJid }
  .withPictureProtocol()       // -> { id, directPath, hash }
  .withTextStatusProtocol()    // -> { text, emoji, setAt, expiresAt }

const result = await sock.executeUSyncQuery(query)
```

---

## 👤 Username Management

Wrapper tingkat tinggi untuk fitur username WhatsApp (handle `@username` sebagai pengganti nomor telepon). Query ID diambil dari sesi WA Web live — kalau suatu panggilan mulai melempar `unexpected response structure`, berarti WA merotasi ID tersebut.

```js
const check = await sock.checkUsername('elyra')       // { available: true, username } atau { available: false, suggestions, rejectionReasons }
await sock.setUsername('elyra', { source: sock.USERNAME_SOURCE.USER_INPUT })
await sock.setUsernamePin('123456')                   // kunci dengan PIN
const mine = await sock.getMyUsername()
await sock.deleteUsername()

const user = await sock.findUserByUsername('someone') // { jid, contact }
const names = await sock.fetchContactUsernames(jid1, jid2, jid3)
const recs = await sock.getUsernameRecommendations()
```

> Butuh akun Community/Contact-tier yang sehat — akun dengan pembatasan WA bisa mendapat hasil `INVALID`/kosong walau username sebenarnya tersedia.

---

## 🤖 Bot Framework

Lapisan opsional di atas socket mentah: routing middleware, dispatcher `!command`, antrian pesan yang selamat dari disconnect, auto-reconnect exponential-backoff, session per-JID, statistik aktivitas grup, serta helper konversi media (sticker / voice note).

Butuh `better-sqlite3` (session + stats) dan `fluent-ffmpeg` (konversi sticker/voice note) — kalau belum terpasang, error-nya memberi petunjuk install.

```js
import { Bot } from 'elyra-baileys'

const bot = new Bot({
  socketConfig: { printQRInTerminal: true },
  dbPath: './bot.db',      // session + stats, default 'baileys_store.db'
  enableStats: true        // leaderboard pesan/sticker + deteksi ghost
})

bot.command('!ping', async (ctx) => {
  await ctx.reply({ text: 'pong' })
})

bot.command('!sticker', async (ctx) => {
  if (!ctx.quoted?.imageMessage) return ctx.reply({ text: 'Reply gambar dengan !sticker' })
  await ctx.replySticker(imageBuffer, { packname: 'Elyra Pack', author: 'you' })
})

bot.onText(async (ctx) => {
  // ctx.session() / setSession() / updateSession() / clearSession() — tersimpan otomatis di SQLite
  const state = ctx.session()
  if (state?.awaitingReply) ctx.updateSession((s) => ({ ...s, awaitingReply: false }))
})

await bot.start()
```

`Context`, `SessionManager`, `StatsManager`, `MediaManager`, dan `SQLiteStore` juga diekspor satuan.

---

## 🧩 Utility Modules

Sebagian utilitas yang diekspor dari `lib/Utils` selain message builder (semua punya `.d.ts`):

| Module | Fungsi |
|---|---|
| `anti-delete` | Deteksi & pulihkan pesan yang dihapus untuk semua orang |
| `auto-reply` | Auto-responder berbasis keyword/pattern |
| `message-search` | Cari pesan tersimpan (mengupas wrapper ephemeral/view-once dulu) |
| `message-retry-manager` | Menangani retry-receipt WhatsApp untuk pesan gagal-dekripsi |
| `scheduling` | Jadwalkan pesan/aksi |
| `business` | Helper business profile & katalog |
| `chat-control` | Pin, mute, archive, tandai baca/belum |
| `chat-history-helpers` | Olah payload history sync |
| `link-preview` | Metadata link preview |
| `stickerpack` | Bangun & kirim sticker pack (termasuk animasi/Lottie) |
| `templates` | Helper template message WhatsApp Business (legacy) |
| `vcard` | Payload kontak vCard |
| `status` | Posting & kelola WhatsApp Status |
| `event-buffer` | Coalesce event socket volume tinggi |
| `reconnect-backoff` | `computeReconnectDelay()` / `createReconnectBackoff()` — full-jitter exponential backoff |
| `bad-mac-handler` | Deteksi/hitung "Bad MAC", safe-wrap fungsi async, cleanup `session-*` / `sender-key-*` opsional |
| `connection-watchdog` | `setupConnectionWatchdog()` / `makeWASocket({ connectionWatchdog: true })` |
| `auto-reconnect` | `autoReconnect(factory, opts)` — tidak reconnect setelah `loggedOut` |
| `auth-secure` | Auth terenkripsi, backup/restore, integrity check, guard pairing/QR, redaksi secret |
| `humanizer` | `sendHumanized()` — typing presence + delay + antrian per chat |
| `mock-socket` | `createMockSocket()` — stand-in offline untuk test logika bot |
| `meta-ai` | `askMetaAI()` (eksperimental) |
| `qr-terminal` | `printQRIfNecessaryListener(ev, logger)` — printer QR terminal opsional |
| `disconnect-reason` | `mapDisconnectReason()`, `isFatalDisconnect()`, `shouldClearAuth()`, `shouldReconnect()`, `getDisconnectInfo()` |
| `phone-utils` | `validateE164()`, `jidToPhone()`, `phoneToJid()` |
| `text-tools` | `parseMentions()`, `extractGroupInviteCode()`, `joinGroupViaLink()` |
| `pairing-utils` | `normalizePairingCode()`, `formatPairingCode()`, `pairingErrorCode()`, `isRateLimitError()` |
| `username` | `validateUsername()`, `isUsernamePin()`, `displayUsername()` |
| `jid-tools` | `getPhoneNumber()`, `resolveSenderPn()`, `getLidForPhone()` |
| `tag` | `tagAll()`, `hideTag()`, `buildTagContent()` |
| `ffmpeg-path` | `setFfmpegPath()`, `resolveFfmpegPath()`, `requireFfmpegPath()` |
| `voice-note` | `sendVoiceNote()`, `buildVoiceNoteContent()` — mono 16 kHz Opus/OGG sebagai PTT |
| `text-format` | `splitText()`, `whatsappify()`, `sendLongText()` |
| `lock-manager` | `makeLockManager()` — lock bernama deterministik |
| `migrate-auth-state` | `migrateAuthState({ from, to })` — salin creds + keys antar auth store |
| `passkey` | `getPasskeyRequestState(node)` |

Tes logika bot tanpa akun WhatsApp:

```js
import { createMockSocket } from 'elyra-baileys'

const mock = createMockSocket()
myBotSetup(mock.sock)                              // kode bot aslimu, tanpa diubah
await mock.receiveText('628000000001@s.whatsapp.net', '!ping')
const out = await mock.waitForReply()
```

---

## 📘 TypeScript

Setiap file di `lib/` punya `.d.ts` pasangan, termasuk seluruh `Types/*` (Auth, Chat, Contact, Events, GroupMetadata, Message, Product, Signal, USync, dll.) dan `WAProto/index.d.ts` (juga lewat export `./WAProto`). Tidak perlu paket `@types/`.

```ts
import makeWASocket, { useSqliteAuthState, proto } from 'elyra-baileys'
```

> Deklarasi dihasilkan dari source, jadi sebagian signature longgar (`any`) dan tipe `proto` menerima key bebas.

---

## 🛠 Environment yang Disarankan

| Kebutuhan | Versi |
|---|---|
| Node.js | 20+ (22.13+ jika ingin SQLite tanpa dependency tambahan) |
| Module system | ESM |
| WhatsApp | Multi Device terbaru |

---

## 📁 Struktur Package

```
elyra-baileys
├── lib/
│   ├── Builders/      Button, ButtonV2/V3, Carousel, Poll, AIRich, A2UI
│   ├── Framework/     Bot, Context, SessionManager, StatsManager, MediaManager, SQLiteStore
│   ├── Socket/        socket, messages-send/recv, chats, groups, newsletter, username, ...
│   ├── Utils/         auth state, media, helper & utilitas
│   ├── VoIP/          audio call stack + relay WebRTC
│   ├── WAUSync/       USync query & protocols
│   ├── WABinary/      encoder/decoder node biner WhatsApp
│   └── assets/wasm/   WASM call engine
├── WAProto/           protobuf WhatsApp (index.js + index.d.ts)
├── docs/FEATURES.md   dokumentasi lengkap + API reference
├── NOTICE.md          atribusi komponen pihak ketiga
└── LICENSE
```

Dokumentasi lengkap (arsitektur, API reference, cookbook, panduan migrasi & troubleshooting): [docs/FEATURES.md](docs/FEATURES.md).

---

## 🆚 Perbedaan dengan Upstream

- **Auto-follow channel aktif secara default** ke saluran resmi pengembang Baileys (`120363400612665352@newsletter`). Matikan dengan `makeWASocket({ autoFollowNewsletterOnConnect: false })`, atau ganti channel lewat `autoFollowNewsletterJid`.
- Tidak ada channel / grup / donate link bawaan yang dipaksakan.
- Banner startup bisa dimatikan: `ELYRA_BANNER=0`.
- `AIRich` tidak lagi menempelkan `botMetadata.verificationMetadata` placeholder secara default (opt-in: `setVerificationMetadata(true)`).
- JID bot AI memakai satu konstanta `DEFAULT_AI_BOT_JID` (override via env `ELYRA_AI_BOT_JID` atau `setForwardBotJid()` per pesan).
- Fix `form_message` dan alur phash-retry milik Elyra sendiri dipertahankan; tidak diganti dengan implementasi upstream.

---

## 📚 Fork Lineage

```
elyra-baileys
└── @vanzxy/baileys
    └── @itsliaaa/baileys
        └── WhiskeySockets/Baileys
```

Hormat untuk semua maintainer dan kontributor asli.

---

## ❓ FAQ & Troubleshooting

<details>
<summary><b>Koneksi terus putus / reconnect loop</b></summary>
<br/>

Cek `lastDisconnect.error` di `connection.update`. Status `401` (loggedOut) berarti sesi sudah invalid dan perlu scan ulang — jangan auto-reconnect. Untuk status lain (`428`, `440`, dst.) reconnect dengan backoff biasanya cukup (`autoReconnect()` / `reconnect-backoff`).

</details>

<details>
<summary><b>QR tidak muncul / tidak ke-scan</b></summary>
<br/>

`printQRInTerminal` sudah deprecated di upstream — render QR sendiri dari event `qr`. Kalau QR muncul tapi linking gagal, biasanya versi WA Web (`version`) sudah kedaluwarsa; gunakan versi terbaru.

</details>

<details>
<summary><b>Error "Bad MAC" / pesan gagal didekripsi</b></summary>
<br/>

Umumnya karena auth state korup atau sesi dipakai di lebih dari satu proses. Pastikan hanya satu instance menulis ke auth state yang sama. Untuk file auth, pertimbangkan `pruneStaleAuthFiles()`; modul `bad-mac-handler` membantu deteksi & cleanup.

</details>

<details>
<summary><b>"No SQLite driver found" saat memakai useSqliteAuthState</b></summary>
<br/>

Runtime kamu tidak punya `bun:sqlite` maupun `node:sqlite` (butuh Node ≥ 22.13). Jalankan `npm i better-sqlite3`, atau upgrade Node.

</details>

<details>
<summary><b>"database is locked" pada SQLite auth</b></summary>
<br/>

Pastikan hanya satu proses yang membuka file `.db` yang sama. `busy_timeout` 5 detik dan mode WAL sudah aktif otomatis, tapi dua bot pada satu file tetap tidak didukung.

</details>

<details>
<summary><b>Memori terus naik di bot yang jalan lama</b></summary>
<br/>

`makeInMemoryStore()` tumbuh tanpa batas. Untuk bot long-running, pindah ke salah satu backend `makePersistentStore()` dan gunakan `event-buffer` untuk meredam lonjakan event.

</details>

<details>
<summary><b>Voice call gagal connect</b></summary>
<br/>

Fitur eksperimental dan butuh `@roamhq/wrtc` dengan binding native yang cocok untuk platform kamu. Cek `call.on('ended', reason => ...)` untuk penyebabnya.

</details>

---

## 🤝 Contributing

Kontribusi dipersilakan — terutama perbaikan bug, dokumentasi, dan peningkatan `MessageBuilder` / `AIRich`.

1. Fork repo ini dan buat branch dari `main` (`feat/nama-fitur` atau `fix/nama-bug`).
2. Pastikan perubahan tetap ESM-only dan menyertakan/menyesuaikan `.d.ts` terkait.
3. Uji pada minimal satu jalur auth state dan satu store backend sebelum PR.
4. Buka Pull Request dengan deskripsi singkat: apa yang berubah dan kenapa.

Untuk laporan bug, sertakan versi Node.js, langkah reproduksi, dan potongan `lastDisconnect.error` bila relevan. Aturan perubahan protobuf dan checklist rilis ada di [docs/FEATURES.md](docs/FEATURES.md).

---

## 🙏 Kontributor & Credits

Package ini adalah fork berantai. Kredit tetap untuk semua pengembang asli.

### Jalur fork

| Peran | Project | Author |
|---|---|---|
| Library asli | [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) | Rajeh Taher / WhiskeySockets & kontributor |
| **Pengembang utama jalur fork** | [@itsliaaa/baileys](https://github.com/itsliaaa/baileys) | **Lia Wynn (itsliaaa)** |
| Fork langsung (base package ini) | [@vanzxy/baileys](https://github.com/vanzxysenpai/vanzxybaileys) | Vanzxy |
| Maintainer | [elyra-baileys](https://github.com/Lynxcode-id/elyra-baileys) | Elyra Labs — [Lynxcode-id](https://github.com/Lynxcode-id) |

### Kontribusi per komponen

| Komponen | Sumber | Author |
|---|---|---|
| **SQLite auth multi-driver, refresh WAProto, versi WA, fix upload newsletter, peta media (v1.1.0)** | `@itsliaaa/baileys` | **Lia Wynn (itsliaaa)** |
| MessageBuilder / AIRich / Button / Carousel / Toolkit (implementasi dasar) | "NIXCODE — Advanced WhatsApp Interactive Message Builder" | **Nixel**, dengan kontribusi **Ahmad tumbuh kembang** |
| Resolusi addon-kind button/list | [zapo](https://github.com/vinikjkkj/zapo) | **vinikjkkj** |
| Button helper / button-sender / interactive native-flow send layer, username management, addon batch Bail-master | [`@queenanya/baileys`](https://github.com/QueenAnya/Bail) | **QueenAnya** |
| Bot Framework (PR WhiskeySockets/Baileys #2710) | WhiskeySockets/Baileys | **LuferOS** (+ perbaikan P0–P3 & rewrite TS oleh QueenAnya) |
| Chat-control, make-cache-manager-store | `@innovatorssoft/baileys` | **innovatorssoft** |
| Auto-reconnect, auth-secure, humanizer, mock-socket, meta-ai, text-tools, jid-tools, tag, ffmpeg-path, voice-note | `@japofc/baileys` | **JAPofc (J.AP)** |
| Protocol USync tambahan (Business, Picture, TextStatus, Sidelist, Feature) | `@nexustechpro/baileys` | **nexustechpro2** |
| Reconnect backoff, Bad MAC handler, connection watchdog | `@lpzeravk/baileys` / `@systemzero/baileys` | **lpzeravk / systemzero** |
| VoIP (WASM call stack + relay WebRTC), AutoFollow newsletter | ourin-baileys | **ourin-baileys** |
| group-metadata-cache, username util | `@rexxhayanasi/elaina-baileys` | **rexxhayanasi** |
| disconnect-reason, phone-utils | `kangwifi72/baileys` | **kangwifi72** |
| pairing-utils, text-format | `xbibzlibrary/whatsbibz` | **xbibzlibrary** |
| Builder upgrade pass (split-button, MPM, Carousel.makeCard, android stanza id) | betton | **betton** |

Detail lisensi dan lokasi file per komponen: [NOTICE.md](NOTICE.md).

### Kontributor repo

<a href="https://github.com/Lynxcode-id/elyra-baileys/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Lynxcode-id/elyra-baileys" alt="Contributors"/>
</a>

Kalau ada atribusi yang keliru atau komponen yang terlewat, buka issue di repo ini — salah atribusi adalah bug yang harus diperbaiki.

---

## ⚠️ Disclaimer

Tidak berafiliasi dengan WhatsApp/Meta. Proyek ini fork independen; pakai dengan risiko sendiri dan patuhi Terms of Service WhatsApp. Hindari spam/bulk message agar nomor tidak terkena ban.

---

## 📄 License

MIT — lihat [LICENSE](LICENSE).

<p align="right"><a href="#top">⬆ kembali ke atas</a></p>
