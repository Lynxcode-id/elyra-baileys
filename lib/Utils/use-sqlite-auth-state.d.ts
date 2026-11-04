import type { AuthenticationCreds, SignalDataTypeMap } from '../Types/index.js';
type SqliteDatabaseLike = { prepare(sql: string): any; exec(sql: string): any; close(): any; [key: string]: any };
export type SqliteAuthStateOptions = {
    /** Path to the database file. Alias of `database` when it is a string. */
    dbPath?: string;
    /** An existing database instance (not closed by `close()`), or a path string. */
    database?: SqliteDatabaseLike | string;
    /** Passive WAL checkpoint interval in ms (owned databases only). Default 30 min, 0 disables. */
    walCheckpointIntervalMs?: number;
};
export type SqliteAuthState = {
    state: {
        creds: AuthenticationCreds;
        keys: {
            get: <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => { [id: string]: SignalDataTypeMap[T] };
            set: (data: { [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] | null } }) => void;
            list: (type: string) => AsyncGenerator<[string, any], void, unknown>;
            listIds: (type: string) => AsyncGenerator<string, void, unknown>;
        };
    };
    saveCreds: () => void;
    close: () => void;
};
export function useSqliteAuthState(dbPath: string, database?: SqliteDatabaseLike): Promise<SqliteAuthState>;
export function useSqliteAuthState(opts: SqliteAuthStateOptions | SqliteDatabaseLike): Promise<SqliteAuthState>;
