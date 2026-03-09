-- Run this in your Supabase SQL Editor to fix the missing columns

-- First, back up any existing data if necessary, though we just launched.
-- Add the email column to BackerProfile (must be nullable first or provide a default if rows exist)
ALTER TABLE public."BackerProfile" 
ADD COLUMN IF NOT EXISTS "email" text;

-- Our API expects `phone` to exist on both, let's make sure it wasn't dropped when we switched earlier
ALTER TABLE public."StudentPitch" 
ADD COLUMN IF NOT EXISTS "phone" text;

ALTER TABLE public."BackerProfile" 
ADD COLUMN IF NOT EXISTS "phone" text;
