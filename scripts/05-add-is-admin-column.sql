-- Add is_admin column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);

-- Update existing admins to have is_admin = true
UPDATE public.users
SET is_admin = true
WHERE id IN (
  SELECT user_id 
  FROM public.admins 
  WHERE is_active = true
);

-- Create a function to automatically set is_admin when admin record is created
CREATE OR REPLACE FUNCTION sync_user_admin_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    UPDATE public.users
    SET is_admin = true
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.users
    SET is_admin = NEW.is_active
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users
    SET is_admin = false
    WHERE id = OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync admin status
DROP TRIGGER IF EXISTS trigger_sync_admin_status ON public.admins;
CREATE TRIGGER trigger_sync_admin_status
AFTER INSERT OR UPDATE OR DELETE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION sync_user_admin_status();
