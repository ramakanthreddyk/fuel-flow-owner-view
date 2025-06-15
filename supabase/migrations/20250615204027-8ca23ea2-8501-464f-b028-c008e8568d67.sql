
-- 1. Function: Automatically insert a default role in user_roles after a new user is inserted in users
CREATE OR REPLACE FUNCTION public.handle_new_user_role_on_users_insert()
RETURNS trigger AS $$
BEGIN
  -- Only insert if not already present in user_roles and user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.id
  ) AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = NEW.id
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee');  -- Change 'employee' to your default if you prefer
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Remove any pre-existing similar trigger to avoid duplicates
DROP TRIGGER IF EXISTS after_users_insert_user_roles ON public.users;

-- 3. Create the trigger on users
CREATE TRIGGER after_users_insert_user_roles
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role_on_users_insert();

