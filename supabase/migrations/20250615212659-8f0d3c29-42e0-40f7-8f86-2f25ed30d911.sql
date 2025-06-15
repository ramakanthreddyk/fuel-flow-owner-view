
-- Add the missing "city" column to stations
ALTER TABLE stations ADD COLUMN IF NOT EXISTS city TEXT;

-- (Optional: Set a default value if needed. Not set here)
