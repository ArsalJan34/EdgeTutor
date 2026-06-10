import sqlite3

DB_PATH = "edgetutor.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            topic       TEXT    NOT NULL,
            score       INTEGER NOT NULL,
            total       INTEGER NOT NULL,
            percentage  INTEGER NOT NULL,
            difficulty  TEXT    NOT NULL DEFAULT 'medium',
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS quiz_results (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_id   INTEGER NOT NULL REFERENCES quiz_attempts(id),
            question     TEXT    NOT NULL,
            correct      INTEGER NOT NULL,
            selected     TEXT    NOT NULL,
            correct_ans  TEXT    NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            question   TEXT NOT NULL,
            answer     TEXT NOT NULL,
            mode       TEXT NOT NULL DEFAULT 'tutor',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    conn.close()
