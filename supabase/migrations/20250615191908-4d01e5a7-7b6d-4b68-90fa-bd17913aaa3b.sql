
-- 🔥 Step 1: Drop all RLS policies on nozzles (that may reference station_id)
DO $$
DECLARE policy RECORD;
BEGIN
  FOR policy IN SELECT * FROM pg_policies WHERE tablename='nozzles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.nozzles;', policy.policyname);
  END LOOP;
END $$;

-- 🛠 Step 2: Rerun the migration (schema fixes)
DO $$ BEGIN
  CREATE TYPE sale_status AS ENUM ('draft', 'confirmed', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('basic', 'premium');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('superadmin', 'owner', 'employee');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE nozzles DROP COLUMN IF EXISTS station_id;
ALTER TABLE nozzles ADD COLUMN IF NOT EXISTS pump_id uuid;
ALTER TABLE nozzles ADD CONSTRAINT nozzles_pump_id_fkey FOREIGN KEY (pump_id) REFERENCES pumps(id);

ALTER TABLE users DROP COLUMN IF EXISTS role;
ALTER TABLE tank_refills RENAME COLUMN volume TO litres;
ALTER TABLE tender_entries RENAME COLUMN entry_datetime TO created_at;
ALTER TABLE sales RENAME COLUMN reading_datetime TO recorded_at;
ALTER TABLE ocr_readings RENAME COLUMN reading_datetime TO recorded_at;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS price_per_litre numeric;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS reading_id uuid;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_number text;
DELETE FROM users WHERE id NOT IN (SELECT user_id FROM user_roles);

-- ✅ Step 3: (Optional/Recommended) Recreate view policy using pump hierarchy
CREATE POLICY "View nozzles for my stations"
ON public.nozzles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.pumps
    WHERE pumps.id = nozzles.pump_id
      AND pumps.station_id IN (
        SELECT station_id FROM public.employee_station_assignments
        WHERE user_id = auth.uid()
      )
  )
);
