-- Update payment_method check constraint to include 'transfer' and 'cod'
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('mada', 'visa', 'mastercard', 'cash', 'cod', 'transfer', 'apple_pay'));
