
-- Function: Automatically insert a default role in user_roles when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_roles()
RETURNS trigger AS $$
BEGIN
  -- Only insert if not already present
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee');  -- You may customize this default role
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove old trigger if exists
DROP TRIGGER IF EXISTS after_signup_roles ON auth.users;

-- Create trigger: after inserting into auth.users, run handle_new_user_roles
CREATE TRIGGER after_signup_roles
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_roles();
