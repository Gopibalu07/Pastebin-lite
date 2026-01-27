CREATE TABLE pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NULL,
    max_views INT NULL,
    views INT NOT NULL DEFAULT 0
);
