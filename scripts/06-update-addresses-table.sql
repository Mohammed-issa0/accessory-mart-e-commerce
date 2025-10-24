-- Update addresses table to match new simplified structure
ALTER TABLE addresses 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS country,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS address_line1,
DROP COLUMN IF EXISTS address_line2,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS address_type;

-- Add new columns if they don't exist
ALTER TABLE addresses 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS delivery_address TEXT NOT NULL DEFAULT '';

-- Rename full_name column if it's named differently
ALTER TABLE addresses 
RENAME COLUMN phone TO phone_number;

-- Update existing records to have default values
UPDATE addresses 
SET delivery_address = COALESCE(address_line1, '') || ' ' || COALESCE(address_line2, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(country, '')
WHERE delivery_address = '';
