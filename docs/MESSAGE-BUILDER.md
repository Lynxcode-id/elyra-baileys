# Message Builder (v4.7) — elyra-baileys

Panduan lengkap builder pesan interaktif di **elyra-baileys**: `Button`, `ButtonV2`, `ButtonV3`, `Carousel`, `Poll`, `Album`, `Event`, `A2UI`, dan terutama **`AIRich`** (respons kaya ala asisten AI).

Builder ini disinkronkan dengan **MessageBuilder v4.7** (NIXCODE / Nixel) dan sudah terintegrasi langsung ke socket elyra-baileys: tidak perlu paket tambahan, tidak perlu `import ... from 'baileys'`.

> `import { AIRich, Button, Carousel } from 'elyra-baileys'` — itu saja.

- [Mulai cepat](#mulai-cepat)
- [Konsep dasar (BaseBuilder)](#konsep-dasar-basebuilder)
- [Toolkit](#toolkit)
- [Button, ButtonV2, ButtonV3](#button-buttonv2-buttonv3)
- [Carousel](#carousel)
- [Poll, Album, Event, Expiring, A2UI](#poll-album-event-expiring-a2ui)
- [AIRich](#airich)
  - [Alur dasar](#alur-dasar)
  - [Sistem id: id / insertAt / replace / delete](#sistem-id)
  - [Konten bawaan](#konten-bawaan)
  - [Edit live (sendEdit)](#edit-live-sendedit)
  - [Menggabungkan beberapa AIRich](#menggabungkan-beberapa-airich)
  - [Memuat pesan yang sudah ada (loadFrom)](#memuat-pesan-yang-sudah-ada)
  - [Pengaturan envelope & bot metadata](#pengaturan-envelope--bot-metadata)
  - [Konten lanjutan](#konten-lanjutan)
- [Hub ElyraBaileys](#hub-elyrabaileys)
- [Error](#error)
- [Perbedaan dengan MessageBuilder 4.7 standalone](#perbedaan-dengan-messagebuilder-47-standalone)
- [Dependensi opsional](#dependensi-opsional)
- [Kredit & lisensi](#kredit--lisensi)

---

## Mulai cepat

```js
import makeWASocket, { AIRich, Button, Carousel, useMultiFileAuthState } from 'elyra-baileys'

const { state, saveCreds } = await useMultiFileAuthState('./session')
const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)

// Tombol interaktif
await new Button(sock)
  .setTitle('Menu')
  .setBody('Pilih salah satu')
  .setFooter('elyra-baileys')
  .addReply('Halo', 'hi')
  .addUrl('Website', 'https://example.com')
  .send(jid)

// Respons kaya (AI Rich)
await new AIRich(sock)
  .setTitle('Elyra')
  .addText('Halo! Ini [link](https://example.com) dan citation [](https://example.com/src)')
  .addCode('javascript', 'console.log("hi")')
  .addSuggest(['Lanjut', 'Selesai'])
  .send(jid)
```

Semua builder menerima **socket** (hasil `makeWASocket`) di constructor. `send(jid, options)` mengirim; `build(jid, options)` hanya membuat pesan tanpa mengirim.

Nama lain (alias) yang tersedia untuk `AIRich`: `ORich`, `ElyraAI`, `ElyraRich`, `AIElyra`, `RichElyra`, `LeafRich`.

Versi builder bisa dibaca lewat konstanta `MESSAGE_BUILDER_VERSION` (`'4.7'`).

---

## Konsep dasar (BaseBuilder)

Semua builder mewarisi `BaseBuilder`:

| Method | Fungsi |
| --- | --- |
| `setTitle(string)` | Judul / header |
| `setSubtitle(string)` | Subjudul |
| `setBody(string)` | Isi / teks utama |
| `setFooter(string)` | Footer |
| `setContextInfo(object)` | `contextInfo` mentah (quoted, mention, forward, dsb.) |
| `addPayload(object)` | Gabungkan payload tambahan ke isi pesan |

Semua method chainable dan melempar `TypeError` jika tipe argumen salah.

---

## Toolkit

Helper statis yang dipakai builder dan boleh dipakai langsung:

| Method | Fungsi |
| --- | --- |
| `Toolkit.extractIE(text, opts)` | Ekstrak markdown `[teks](url)` (hyperlink), `[](url)` (citation), `[ekspresi](url)` bentuk latex ke inline entities |
| `Toolkit.resize(buffer, x, y, fit)` | Resize gambar jadi PNG (butuh `sharp`) |
| `Toolkit.fetchBuffer(url, opts, { silent, timeout })` | Unduh URL jadi Buffer (silent: kembalikan buffer kosong jika gagal) |
| `Toolkit.toUrl(sock, bufferOrUrl, mediaType)` | Upload media ke server WhatsApp, kembalikan URL |
| `Toolkit.resolveMedia(sock, media, mediaType, opts)` | URL / base64 / Buffer → URL, buffer, atau base64 (`result: 'url' \| 'buffer' \| 'base64'`) |
| `Toolkit.getMp4Duration(buffer)` | Durasi MP4 (detik) |
| `Toolkit.getMp4Preview(buffer, opts)` | Thumbnail frame video (butuh `fluent-ffmpeg`) |
| `Toolkit.waitAllPromises(input)` | Selesaikan Promise bersarang di object/array |
| `Toolkit.stringifyEscaped(obj)` | `JSON.stringify` dengan karakter non-ASCII di-escape |

---

## Button, ButtonV2, ButtonV3

### Button (native flow)

```js
const btn = new Button(sock)
  .setTitle('Judul')
  .setBody('Isi')
  .setFooter('Footer')
  .setImage('https://example.com/a.jpg')   // atau Buffer; juga setVideo / setDocument / setMedia
  .addReply('Balas', 'id-1')
  .addUrl('Buka', 'https://example.com')
  .addCopy('Salin kode', 'ABC123')
  .addCall('Telepon', 'call-1', { phone_number: '+62...' })

// Daftar pilihan
btn.addSelection('Pilih')
   .makeSection('Seksi 1')
   .makeRow('', 'Opsi A', 'deskripsi', 'a')
   .makeRow('', 'Opsi B', 'deskripsi', 'b')

await btn.send(jid)
```

Method utama: `addButton(name, params)`, `addReply`, `addUrl`, `addCopy`, `addCall`, `addReminder`, `addCancelReminder`, `addAddress`, `addLocation`, `addSelection` + `makeSection` + `makeRow`, `addOpenWebview`, `addCatalog`, `addViewCatalog`, `addCallPermission`, `addRequestContactInfo`, `addPaymentInfo`, `addReviewAndPay`, `addPay`, `addMPM`, `addPayment`, `addAgentTransfer`, `addReviewOrder`, keluarga `addSplit*`, `addTransactionDetails`, `addMultiProduct`, `addOrderDetails`, `addOrderStatus`, `addPaymentStatus`, `addTrackOrder`, `addFlow`, `addVoiceCall`, `addVideoCall`, `setLimitedTimeOffer`, `setBottomSheet`, `setTapTargetConfiguration`, `setVideoGif`, `setLocationHeader`, `setBloksWidget`, `setParams`, `clearButtons`, `loadFrom(msg)`, `toCard()`, `build()`, `send()`, dan `Button.sendAudio()`.

### ButtonV2 (buttonsMessage klasik)

```js
await new ButtonV2(sock)
  .setTitle('Judul')            // tampil di header lokasi
  .setSubtitle('Alamat')
  .setBody('Isi')
  .setFooter('Footer')
  .setThumbnail('https://example.com/a.jpg')   // URL atau Buffer, di-resize 300x300
  .addButton('Ya', 'yes')
  .addButton('Tidak', 'no')
  .send(jid)
```

- `setThumbnail(urlOrBuffer)` — thumbnail biasa (di-resize otomatis).
- `setRawThumbnail(base64)` — **baru di 4.7**: pakai thumbnail base64 apa adanya tanpa diproses (tidak butuh `sharp`).
- `addRawButton(obj)` — tombol `buttonsMessage` mentah.
- `setMedia(obj)` — pakai media sebagai header menggantikan header lokasi.

### ButtonV3 (template buttons)

`setImage/setVideo/setDocument/setMedia`, `addReply`, `addUrl`, `addCall`, `addButton`, `clearButtons`, `toTemplate()`, `build()`, `send()`.

---

## Carousel

```js
const card = await new Button(sock)
  .setTitle('Produk A')
  .setBody('Deskripsi')
  .setFooter('Rp 10.000')
  .setImage('https://example.com/a.jpg')
  .addUrl('Beli', 'https://example.com/a')
  .toCard()                      // Button → kartu carousel

await new Carousel(sock)
  .setBody('Katalog')
  .setFooter('elyra-baileys')
  .addCard(card)                 // boleh array
  .send(jid)
```

- Setiap kartu **wajib** punya media di header.
- Maksimal `Carousel.MAX_CARDS` (10) kartu.
- Helper: `makeCard(...)`, `clearCards()`, `loadFrom(msg)`.

---

## Poll, Album, Event, Expiring, A2UI

| Builder | Method utama |
| --- | --- |
| `Poll` | `setName`, `addOption`, `addOptions`, `setSelectable`, `setMultiSelect`, `setHideVoter`, `setCanAddOption`, `setAnnouncementGroup`, `setEndDate`, `setQuiz`, `send` |
| `Album` | `addImage`, `addVideo`, `addMany`, `setCaption`, `setDelay`, `setContinueOnError`, `send` |
| `Event` | `setName`, `setDescription`, `setStart`, `setEnd`, `setLocation`, `setCall`, `setCancelled`, `setExtraGuestsAllowed`, `setScheduleCall`, `setReminder`, `send` |
| `Expiring` / `ExpiringButton` | Pesan dengan masa berlaku |
| `A2UI` | Komponen UI deklaratif (`text`, `image`, `button`, `card`, `row`, `column`, `list`, `tabs`, ...) + `send` |

---

## AIRich

`AIRich` membuat **respons kaya**: teks markdown dengan link/citation/LaTeX, blok kode berwarna, tabel, gambar, video, reels, produk, post, widget, saran lanjutan, dan banyak lagi. Pesan bisa **disusun bertahap lalu diedit live** di chat yang sama.

### Alur dasar

```js
const rich = new AIRich(sock, { dynamic: true, unsupportedTypeAlert: true })
  .setTitle('Judul')                  // disclaimer bot di atas pesan
  .addText('Halo **dunia**')
  .setFooter('Footer')

const msg = await rich.send(jid)      // kirim; hasilnya WAMessage
```

Opsi constructor:

| Opsi | Default | Arti |
| --- | --- | --- |
| `dynamic` | `true` | Buat `response_id` baru di setiap `build()` |
| `unsupportedTypeAlert` | `true` | Tambah teks `[ UNSUPPORTED_TYPE - ... ]` untuk klien yang belum mendukung tipe tertentu |

Opsi `send(jid, options)` / `build(jid, options)`:

| Opsi | Default | Arti |
| --- | --- | --- |
| `bypassDownload` | `true` | Kirim edit susulan agar pesan langsung tampil tanpa unduh |
| `forwarded` | `true` | Tandai sebagai diteruskan dari bot AI |
| `notification` | `false` | Sertakan metadata transparansi sesi |
| `includesUnifiedResponse` | `true` | Sertakan unified response (sections) |
| `includesSubmessages` | `true` | Sertakan submessages (fallback klien lama) |
| `quoted`, `quotedParticipant` | — | Balas pesan |
| `messageId`, `additionalNodes` | — | ID pesan sendiri / node tambahan |

### Sistem id

Setiap `add*()` menerima `{ id, replace, insertAt }`:

```js
rich.addText('Intro', { id: 'intro' })                    // beri id
rich.addText('Sesudah intro', { insertAt: 'intro' })      // sisipkan SETELAH 'intro'
rich.addImage(url, { replace: 'img1' })                   // ganti blok 'img1' di posisinya
rich.delete('intro')                                      // hapus blok
```

**Target dengan offset** (v4.7): `insertAt`, `replace`, dan `delete` menerima `id` atau `[id, offset]`. Offset dihitung dalam **blok** (satu pemanggilan `add*()` = satu blok).

```js
rich.addText('A', { id: 'a' }).addText('B', { id: 'b' }).addText('C', { id: 'c' })

rich.addText('X', { insertAt: ['c', -1] })   // sebelum blok yang ada di sebelah kiri 'c'  → A X B C
rich.addText('Y', { replace: ['a', 1] })     // ganti blok tepat setelah 'a' (yaitu 'b')
rich.delete(['c', -1])                       // hapus blok tepat sebelum 'c'
```

| Method | Fungsi |
| --- | --- |
| `hasId(id)` | Cek apakah id terdaftar |
| `getIds()` | Daftar semua id |
| `peek(id)` | `{ id, sections, submessages, section, submessage }` (item pertama juga tersedia sebagai `section` / `submessage`, kompatibel dengan 4.7) |
| `delete(target)` | Hapus blok; `target` = `id` atau `[id, offset]` |
| `assignId(id)` | Beri id ke blok terakhir yang belum ber-id |
| `assignId(index, id)` | **4.7:** beri id ke section pada urutan `index` |
| `deleteSection(id)` | Alias hapus section |
| `opts(...)` / `optsAt(...)` | Mode fluent: set `{ id, insertAt, replace }` untuk `add*()` berikutnya |
| `addSection(section, options)` | Tambah section mentah (hasil `AIRich.newLayout`) |
| `addSubmessage(submessage, options)` | Tambah submessage mentah |
| `sections` / `items` | Section / primitive yang sudah tersusun (dipakai untuk menggabungkan builder) |

Aturan: id harus unik (`DuplicateIdError`), target harus ada (`ItemNotFoundError`), offset harus di dalam jangkauan (`InvalidTargetError`), `replace` dan `insertAt` tidak boleh dipakai bersamaan.

### Konten bawaan

| Method | Isi |
| --- | --- |
| `addText(text, { hyperlink, citation, latex })` | Markdown: `[teks](url)` link, `[](url)` citation, `[ekspresi\|w\|h](url)` latex |
| `addFOAText(text)` | Teks gaya FOA |
| `addCode(language, code)` | Blok kode dengan syntax highlight |
| `addTable(rows)` | Tabel: baris pertama = header; sel mendukung markdown link |
| `addSource(sources)` | Kartu sumber `[icon, url, title, subtitle]` atau `{ icon, url, title, subtitle }` |
| `addReels(items)` | Carousel reels |
| `addImage(url \| buffer \| array, { width, height, status, update_text })` | Gambar (`status: 'GENERATING'` untuk placeholder loading) |
| `addVideo(url \| buffer \| object, { autoFill, status, estimatedTime })` | Video (durasi/thumbnail otomatis jika `autoFill`) |
| `addProduct(item \| array)` | Kartu produk |
| `addPost(item \| array)` | Kartu post sosial media |
| `addMetadata(text)` / `addTip(text)` | Teks kecil / tip dengan ikon ⓘ |
| `addWidget(data)` | Widget aksi (kalender, CTA) |
| `addFooterAction(data)` | Tombol aksi footer |
| `addSuggest(string \| array, { scroll, layout })` | Pill saran lanjutan |
| `addHeading`, `addDivider`, `addSpacer`, `addLatex`, `addLatexPro`, `addMap`, `addGif`, `addLinks`, `addInlineImage` | Elemen tampilan lain |

Contoh data:

```js
rich.addProduct({ title: 'Elyra', brand: 'Elyra Labs', price: 'Gratis',
                  product_url: 'https://example.com', image_url: 'https://example.com/a.jpg' })

rich.addPost({ profile: 'https://example.com/p.jpg', username: 'lynx', verified: true,
               caption: 'Halo', thumbnail: 'https://example.com/t.jpg', url: 'https://example.com',
               source_app: 'INSTAGRAM' })

rich.addReels({ profile: 'https://example.com/p.jpg', username: 'lynx',
                thumbnail: 'https://example.com/t.jpg', url: 'https://example.com', verified: true })

rich.addWidget({ title: 'Aksi Cepat', sections: [],
                 actions: [{ label: 'Gabung Channel', kind: 'OTHER', state: 'PENDING', id: 'channel' }] })

rich.addFooterAction({ text: 'Kunjungi', url: 'https://example.com' })
```

### Edit live (sendEdit)

Setelah `send()`, builder mengingat kunci pesan terakhir (`rich.lastMessageKey`). Ubah isi builder lalu panggil `sendEdit()` untuk memperbarui pesan yang sama:

```js
import { AIRich } from 'elyra-baileys'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const rich = new AIRich(sock)
  .setTitle('Demo MessageBuilder 4.7')
  .addText('Halo! Selamat datang 👋', { id: 'intro' })
  .setFooter('Dibangun dengan elyra-baileys')

await rich.send(jid)
await delay(1500)

// 1) sisipkan teks tepat setelah 'intro' + saran
rich.addText('Semua yang di bawah ini dibangun langsung di pesan ini.', { insertAt: 'intro', id: 'welcome' })
rich.addSuggest(['MessageBuilder', 'AIRich', 'Elyra'])
await rich.sendEdit()                 // jid & id diambil dari pesan terakhir
await delay(1800)

// 2) placeholder loading → diganti gambar asli
rich.addImage('', { status: 'GENERATING', update_text: 'Membuat gambar...', insertAt: 'welcome', id: 'image1' })
await rich.sendEdit()
await delay(3000)
rich.addImage('https://example.com/a.jpg', { replace: 'image1' })
await rich.sendEdit()

// 3) video: pola yang sama
rich.addVideo('', { status: 'GENERATING', estimatedTime: 3000, insertAt: 'image1', id: 'video1' })
await rich.sendEdit()
await delay(4000)
rich.addVideo('https://example.com/a.mp4', { replace: 'video1' })
await rich.sendEdit()

// 4) kode & tabel
rich.addCode('javascript', 'function greet(n) {\n  return `Hello, ${n}!`\n}', { insertAt: 'video1', id: 'code1' })
rich.addTable([['Nama', 'Peran'], ['[Lynx](https://example.com)', 'Developer']], { insertAt: 'code1', id: 'table1' })
await rich.sendEdit()

// 5) tambah sementara lalu hapus
rich.addMetadata('Ini akan dihapus', { id: 'tmp', insertAt: 'table1' })
await rich.sendEdit()
await delay(2000)
rich.delete('tmp')
await rich.sendEdit()
```

Method terkait: `buildEdit(jid, id, opts)`, `sendEdit(jid?, id?, opts)`, serta varian `buildEditNative` / `sendEditNative`. Jika `jid`/`id` tidak diberikan, dipakai pesan terakhir yang dikirim builder ini; jika belum ada, dilempar error `JID is required` / `Message id is required`.

### Menggabungkan beberapa AIRich

Bangun potongan konten di instance terpisah, ambil `.items`, lalu sisipkan sebagai section ke pesan utama:

```js
const items = new AIRich(sock)
  .addProduct({ title: 'Elyra', brand: 'Elyra Labs', price: 'Gratis', product_url: 'https://example.com', image_url: 'https://example.com/a.jpg' })
  .addPost({ username: 'lynx', verified: true, caption: 'Dibangun terpisah', thumbnail: 'https://example.com/t.jpg', url: 'https://example.com' })
  .items

rich.addSection(AIRich.newLayout('HScroll', items), { insertAt: 'after', id: 'mixed' })
await rich.sendEdit()
```

`AIRich.newLayout(name, data, extra)` membuat section: `name` = `Single`, `HScroll`, dst.; `data` array → `primitives`, object → `primitive`.

### Memuat pesan yang sudah ada

```js
const rich = new AIRich(sock).loadFrom(msg)      // dari WAMessage / message berisi richResponseMessage
rich.addText('Tambahan')
await rich.send(jid)
```

`Button`, `ButtonV2`, dan `Carousel` juga punya `loadFrom(msg)` untuk interactive/buttons message.

### Pengaturan envelope & bot metadata

| Method | Fungsi |
| --- | --- |
| `setResponseId(id)` / `refreshResponseId()` | ID respons |
| `setBotResponseId(id)` / `refreshBotResponseId()` | ID respons bot |
| `setForwarded(bool)` | Tandai diteruskan dari bot AI |
| `setForwardBotJid(jid)` | JID bot (default `DEFAULT_AI_BOT_JID`, ubah dengan env `ELYRA_AI_BOT_JID`) |
| `setNotification(bool, text)` | Metadata transparansi sesi |
| `setVerificationMetadata(bool)` | Sertakan `verificationMetadata` (opt-in, **default mati**) |
| `setMentions(...jids)` / `setQuoted(msg, participant)` | Mention & balasan |
| `setNoContextInfo(bool)` | Tanpa `contextInfo` |
| `setDynamicIDs(bool)` | Sama dengan opsi `dynamic` |
| `setUnsupportedTypeAlert(bool)` | Sama dengan opsi constructor |
| `setByPassDownload(bool)` | Sama dengan `bypassDownload` |
| `setIncludesUnifiedResponse(bool)` / `setIncludesSubmessages(bool)` | Atur isi pesan |
| `setMessageSecret(bool)` | Sertakan `messageSecret` acak |
| `setUnifiedResponseData(data)` | Ganti data unified response secara manual |
| `setBotMetadata(obj)`, `setCapabilities`, `setBotRenderingConfig`, `setThreadType`, `setImagineType`, `setSubscriptionUpsell`, `addEmbeddedScreen` | Metadata bot lanjutan |
| `setRawEnvelope(bool)` | Kirim envelope apa adanya |

### Konten lanjutan

`addImageCard`, `addComment`, `addActionList`, `addChainOfThoughtStep`, `addThinking`, `addThinkingStatus`, `addBotThinking`, `addProgress`, `addProgressStatus`, `addGenerate`, `addGenerating`, `addPrimitive(typeName, payload)`, `addContentRaw(section, submessage)`, `addChainingSuggestion`, `addChainingSuggestionV2`, `addPlaceEntity`, `addSearchResultV2`, `addContextualSources`, `addMediaItem`, `addCompactEntity`, `addTask` / `addTasks`, `addBloks`, `addHTML` / `addHTMLCard` / `addFile` / `addUploadedFile`, `addAddonAction`, `addInlineVideo`, `addVideos`, `addVideoPrimitive`, `addLatexUX`, `addQuotaUpsell*`, `addSearchAd`, `addNestedUnified`, `add3PAccountLinking`, `addSearchPlannerSteps`, `addOrchestratorSearchEngine`, `addProfessionalConsent`, `addEmbeddedContextualScreen`, `addLayout`, `addMultipleResponse`, `addFlexibleGrid`, `addVStack`, dan helper statis `AIRich.sendPairedMedia()`, `AIRich.sendSupportPayload()`, `AIRich.lockHeight()`.

Static yang kompatibel dengan 4.7: `AIRich.newLayout`, `AIRich.toTableMetadata`, `AIRich.tokenizer(code, lang)`, `AIRich.generateVerificationMetadata()`.

---

## Hub ElyraBaileys

Satu objek yang membungkus semua builder:

```js
import { ElyraBaileys } from 'elyra-baileys'

const hub = new ElyraBaileys(sock)
await hub.airich().addText('Halo').send(jid)
await hub.button().setBody('Pilih').addReply('OK', 'ok').send(jid)
```

Method: `airich()` (alias `elyraAI()`, `aiElyra()`, `elyraRich()`, `richElyra()`, `leafRich()`, `AIRich()`), `button()`, `buttonV2()`, `buttonV3()`, `carousel()`, `poll()`, `a2ui()`.

---

## Error

Semua error builder turunan `AIRichError` (punya `name`, `code`, dan metadata tambahan) dan dapat diimpor dari `elyra-baileys`:

| Class | `code` | Kapan |
| --- | --- | --- |
| `AIRichError` | `AIRICH_ERROR` | Dasar |
| `ItemNotFoundError` | `ITEM_NOT_FOUND` | id tidak terdaftar |
| `DuplicateIdError` | `DUPLICATE_ID` | id sudah dipakai |
| `InvalidTargetError` | `INVALID_TARGET` | offset / index di luar jangkauan |
| `ContentValidationError` | `CONTENT_VALIDATION` | argumen tidak valid (mis. `replace` + `insertAt` bersamaan) |

```js
import { ItemNotFoundError, InvalidTargetError } from 'elyra-baileys'

try { rich.addText('x', { insertAt: ['c', 99] }) }
catch (e) { if (e instanceof InvalidTargetError) console.log(e.code, e.index) }
```

> Sejak v1.2.5 `AIRich` memakai class error yang **sama** dengan yang diekspor (`instanceof` kini berfungsi dengan benar).

---

## Perbedaan dengan MessageBuilder 4.7 standalone

| Hal | MessageBuilder 4.7 | elyra-baileys |
| --- | --- | --- |
| Import | `from 'baileys'` + file `MessageBuilder.js` | `from 'elyra-baileys'` |
| Model id | Daftar node (index) | Blok (satu `add*()` = satu blok); offset `[id, n]` dihitung per blok |
| `verificationMetadata` | Selalu disertakan (bytes acak) | Opt-in lewat `setVerificationMetadata(true)` |
| `forwardedAiBotMessageInfo.botJid` | Tetap | `DEFAULT_AI_BOT_JID` / `setForwardBotJid()` |
| `disclaimerText` notifikasi | Teks tetap | Pakai `setTitle()` / `setNotification(true, text)` |
| Konten tambahan | — | Puluhan method tambahan (Bloks, HTML, quota upsell, planner, dll.) |
| Auto-update dari repo | Ya | Tidak (versi ikut paket) |

Kode 4.7 lama bisa dipindah dengan mengganti import menjadi `elyra-baileys`; API `add*`, `send`, `sendEdit`, `insertAt`, `replace`, `delete`, `peek`, `hasId`, `getIds`, `assignId`, `items`, `sections` tetap sama.

---

## Dependensi opsional

Beberapa fitur butuh paket yang dimuat malas (lazy) dan tidak wajib:

| Paket | Dipakai untuk |
| --- | --- |
| `sharp` | Resize thumbnail (`Toolkit.resize`, `ButtonV2.setThumbnail`, gambar/video AIRich) |
| `fluent-ffmpeg` + ffmpeg | Thumbnail otomatis dari video (`addVideo({ autoFill })`) |

Tanpa paket tersebut, builder tetap jalan; fitur yang memerlukannya akan melewati langkah thumbnail atau memberi pesan error yang jelas.

---

## Kredit & lisensi

Desain builder asli: **NIXCODE — Advanced WhatsApp Interactive Message Builder** oleh **Nixel** (kontributor: Ahmad tumbuh kembang). Watermark dan kredit asli dipertahankan di `lib/Builders/AIRich.js` dan `NOTICE.md`.

Ketentuan dari pembuat asli: dipakai dan dimodifikasi untuk proyek pribadi/komersial diperbolehkan; **mengunggah ulang, menjual, mengganti lisensi, atau mendistribusikan builder ini sebagai produk mandiri dilarang**, dan jangan mengklaimnya sebagai karya sendiri.
