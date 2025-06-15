
-- 1. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Only allow inserting new roles if user exists in users
DROP POLICY IF EXISTS "allow_role_insert_for_existing_users" ON public.user_roles;
CREATE POLICY "allow_role_insert_for_existing_users"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = user_roles.user_id
    )
  );

-- 3. (FK constraint step already attempted and should have succeeded if not already present):
-- If the ON DELETE CASCADE step failed before, please send that error and I will assist further.

