-- Add bank_transfer to allowed payment methods
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('mada', 'visa', 'mastercard', 'cash', 'apple_pay', 'bank_transfer'));
