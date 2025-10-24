-- Remove unused columns from orders table
-- shipping_city and shipping_address are replaced by delivery_address

ALTER TABLE public.orders 
DROP COLUMN IF EXISTS shipping_city,
DROP COLUMN IF EXISTS shipping_address;

-- Remove unused columns from addresses table
-- These old fields are replaced by the simplified address structure

ALTER TABLE public.addresses
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS country,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS address_line1,
DROP COLUMN IF EXISTS address_line2,
DROP COLUMN IF EXISTS address_type,
DROP COLUMN IF EXISTS is_default;

-- Add comment to document the cleanup
COMMENT ON TABLE public.orders IS 'Orders table - simplified address structure using delivery_address field';
COMMENT ON TABLE public.addresses IS 'User addresses - simplified structure with full_name, phone_number, whatsapp_number, and delivery_address';
