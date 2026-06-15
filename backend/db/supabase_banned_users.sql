-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- Creates the banned_users table for cross-device ban persistence.

CREATE TABLE IF NOT EXISTS banned_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  reason TEXT DEFAULT '',
  banned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'lifted'))
);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS idx_banned_users_email ON banned_users (email);
CREATE INDEX IF NOT EXISTS idx_banned_users_status ON banned_users (status);

-- Row-level security: only allow service_role access (this is an admin table)
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
