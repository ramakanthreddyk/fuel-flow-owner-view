
-- 1. Insert any missing Auth users into public.users
INSERT INTO public.users (id, name, email, password)
SELECT
  a.id,
  COALESCE(a.raw_user_meta_data ->> 'name', a.email) AS name,
  a.email,
  'changeme' AS password
FROM auth.users a
LEFT JOIN public.users u ON u.id = a.id
WHERE u.id IS NULL;

-- 2. Create a trigger function to insert into public.users after each new signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_to_users()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    INSERT INTO public.users (id, name, email, password)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
      NEW.email,
      'changeme'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop any existing trigger to avoid duplicates
DROP TRIGGER IF EXISTS on_auth_user_created_insert_users ON auth.users;

-- 4. Create the trigger for inserting into users
CREATE TRIGGER on_auth_user_created_insert_users
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user_to_users();
