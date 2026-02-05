
-- Create table for pending user registrations
CREATE TABLE IF NOT EXISTS pending_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('landlord', 'tenant')),
  password_hash TEXT NOT NULL,
  confirmation_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create index on confirmation token for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_users_token ON pending_users(confirmation_token);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_users_email ON pending_users(email);
