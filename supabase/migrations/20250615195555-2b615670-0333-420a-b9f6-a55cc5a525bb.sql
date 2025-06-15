
INSERT INTO public.profiles (id, name, email, role)
SELECT
  u.id,
  u.name,
  u.email,
  -- Default role; change if you want to set roles properly
  'owner'
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
