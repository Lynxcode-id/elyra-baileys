# Changelog

## 1.2.0 - 2026-11-05

- rename: package is now `elyra-baileys` (was `@labs-elyraa/baileys`). `VanzxyBaileys` -> `ElyraBaileys`, `VanzxyAI`/`VanzxyRich`/`AIVanzxy`/`RichVanzxy` -> `ElyraAI`/`ElyraRich`/`AIElyra`/`RichElyra`, `VANZXY_AI_BOT_JID` -> `ELYRA_AI_BOT_JID`. Credits and contributors untouched.
- sync: `@itsliaaa/baileys` 0.4.4.
- fix: correctly detect the exact media type in `prepareWAMessageMedia()`.
- chore: update default socket version to `2.3000.1052983891`.
- chore: update WAProto to `2.3000.1052812464` (`MsgOpaqueData.sharableEventInvite*` fields).
- feat: auto-follow the official Baileys developer channel (`120363400612665352@newsletter`) on connect, enabled by default (`autoFollowNewsletterOnConnect: false` to disable).
- feat: new startup banner, borderless pink gradient. Disable with `ELYRA_BANNER=0`.

## 1.1.0

- sync: `@itsliaaa/baileys` 0.4.3+ (multi-driver SQLite auth state, refreshed WAProto, `server_transcode` newsletter uploads, expanded media path / HKDF mappings). See `docs/FEATURES.md`.
