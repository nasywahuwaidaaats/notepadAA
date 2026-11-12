
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    updated_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO documents (id, content, updated_at)
VALUES ('main', '', 0);
