-- Add receipt_url column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Add comment
COMMENT ON COLUMN orders.receipt_url IS 'URL to the payment receipt uploaded by customer';
COMMENT ON COLUMN orders.delivery_address IS 'Full delivery address from customer';
COMMENT ON COLUMN orders.whatsapp_number IS 'Customer WhatsApp number';
