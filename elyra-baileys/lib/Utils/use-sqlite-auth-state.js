import { proto } from '../../WAProto/index.js';
import { initAuthCreds } from './auth-utils.js';
import { BufferJSON } from './generics.js';
// Synced with itsliaaa/baileys (27-10-26): synchronous prepared statements, multi-driver support
// (bun:sqlite, node:sqlite, better-sqlite3), WITHOUT ROWID tables, and an IMMEDIATE write transaction.
// Elyra additions: object-style options, `keys.list` / `keys.listIds`, and a passive WAL checkpoint timer.
const CREDS_KEY = '__creds__';
const SCHEMA = `
PRAGMA busy_timeout = 5000;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
CREATE TABLE IF NOT EXISTS creds (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS signal_keys (
    type TEXT NOT NULL,
    id TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (type, id)
) WITHOUT ROWID;
DROP INDEX IF EXISTS signal_keys_type_idx;
`;
const loadDriver = async () => {
    if (process.versions.bun)
        return (await import('bun:sqlite')).Database;
    try {
        return (await import('node:sqlite')).DatabaseSync;
    }
    catch { }
    try {
        const mod = await import('better-sqlite3');
        return mod.default ?? mod;
    }
    catch (cause) {
        throw new Error('No SQLite driver found. Use Bun, Node >= 22.13, or install "better-sqlite3".', { cause });
    }
};
const isDatabaseLike = (v) => !!v && typeof v === 'object' && typeof v.prepare === 'function' && typeof v.exec === 'function';
/**
 * Accepted call styles:
 *   useSqliteAuthState('./auth.db')                       // path
 *   useSqliteAuthState('./auth.db', existingDb)           // itsliaaa-style (db is NOT closed by close())
 *   useSqliteAuthState({ dbPath: './auth.db' })           // elyra-baileys style
 *   useSqliteAuthState({ database: existingDb })          // elyra-baileys style (db is NOT closed by close())
 *   useSqliteAuthState({ database: './auth.db' })         // path via `database`
 */
export async function useSqliteAuthState(optsOrPath, ownedDatabase) {
    let dbPath;
    let external;
    let checkpointMs = 30 * 60 * 1000;
    if (typeof optsOrPath === 'string') {
        dbPath = optsOrPath;
        external = ownedDatabase;
    }
    else if (isDatabaseLike(optsOrPath)) {
        external = optsOrPath;
    }
    else if (optsOrPath && typeof optsOrPath === 'object') {
        if (isDatabaseLike(optsOrPath.database))
            external = optsOrPath.database;
        else
            dbPath = optsOrPath.dbPath ?? optsOrPath.path ?? (typeof optsOrPath.database === 'string' ? optsOrPath.database : undefined);
        if (isDatabaseLike(ownedDatabase))
            external = ownedDatabase;
        if (typeof optsOrPath.walCheckpointIntervalMs === 'number')
            checkpointMs = optsOrPath.walCheckpointIntervalMs;
    }
    if (!external && !dbPath)
        throw new TypeError('useSqliteAuthState: provide a database path or an existing database instance');
    const owned = !external;
    let db = external;
    if (owned) {
        const Database = await loadDriver();
        db = new Database(dbPath);
    }
    db.exec(SCHEMA);
    const acts = {
        credsGet: db.prepare('SELECT value FROM creds WHERE key = ?'),
        credsSet: db.prepare('INSERT OR REPLACE INTO creds (key, value) VALUES (?, ?)'),
        keyGet: db.prepare('SELECT value FROM signal_keys WHERE type = ? AND id = ?'),
        keySet: db.prepare('INSERT OR REPLACE INTO signal_keys (type, id, value) VALUES (?, ?, ?)'),
        keyDel: db.prepare('DELETE FROM signal_keys WHERE type = ? AND id = ?'),
        keyList: db.prepare('SELECT id, value FROM signal_keys WHERE type = ? ORDER BY id'),
        keyListIds: db.prepare('SELECT id FROM signal_keys WHERE type = ? ORDER BY id'),
        begin: db.prepare('BEGIN IMMEDIATE'),
        commit: db.prepare('COMMIT'),
        rollback: db.prepare('ROLLBACK')
    };
    const revive = (type, raw) => {
        const value = JSON.parse(raw, BufferJSON.reviver);
        return type === 'app-state-sync-key' && value
            ? proto.Message.AppStateSyncKeyData.fromObject(value)
            : value;
    };
    // Passive WAL checkpoint only. Elyra no longer prunes `pre-key` / `session` rows automatically,
    // because deleting sessions beyond an arbitrary row count could break live conversations.
    let checkpointTimer;
    if (owned && checkpointMs > 0) {
        checkpointTimer = setInterval(() => {
            try {
                db.exec('PRAGMA wal_checkpoint(PASSIVE)');
            }
            catch { }
        }, checkpointMs);
        checkpointTimer.unref?.();
    }
    const row = acts.credsGet.get(CREDS_KEY);
    const creds = row ? JSON.parse(row.value, BufferJSON.reviver) : initAuthCreds();
    let lastCreds = row?.value;
    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    const data = {};
                    for (const id of ids) {
                        const r = acts.keyGet.get(type, id);
                        if (!r)
                            continue;
                        data[id] = revive(type, r.value);
                    }
                    return data;
                },
                set: (data) => {
                    acts.begin.run();
                    try {
                        for (const type in data) {
                            const items = data[type];
                            for (const id in items) {
                                const value = items[id];
                                if (value)
                                    acts.keySet.run(type, id, JSON.stringify(value, BufferJSON.replacer));
                                else
                                    acts.keyDel.run(type, id);
                            }
                        }
                        acts.commit.run();
                    }
                    catch (err) {
                        try {
                            acts.rollback.run();
                        }
                        catch { }
                        throw err;
                    }
                },
                async *list(type) {
                    for (const r of acts.keyList.all(type))
                        yield [r.id, revive(type, r.value)];
                },
                async *listIds(type) {
                    for (const r of acts.keyListIds.all(type))
                        yield r.id;
                }
            }
        },
        saveCreds: () => {
            const json = JSON.stringify(creds, BufferJSON.replacer);
            if (json === lastCreds)
                return;
            acts.credsSet.run(CREDS_KEY, json);
            lastCreds = json;
        },
        close: () => {
            if (checkpointTimer)
                clearInterval(checkpointTimer);
            if (owned)
                db.close();
        }
    };
}
