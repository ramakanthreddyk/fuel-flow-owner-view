
-- -------------------------------------------
-- 01_create_schema.sql - Initial schema for FuelSync
-- -------------------------------------------

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Stations table
CREATE TABLE IF NOT EXISTS public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  deleted_at TIMESTAMPTZ
);

-- Pumps table
CREATE TABLE IF NOT EXISTS public.pumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id),
  label TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Nozzles table
CREATE TABLE IF NOT EXISTS public.nozzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pump_id UUID REFERENCES public.pumps(id),
  label TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  initial_reading NUMERIC,
  deleted_at TIMESTAMPTZ
);

-- Sales table
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id),
  nozzle_id UUID REFERENCES public.nozzles(id),
  fuel_type TEXT NOT NULL,
  litres NUMERIC,
  amount NUMERIC,
  price_per_litre NUMERIC,
  sale_datetime TIMESTAMPTZ,
  source TEXT,
  entered_by UUID REFERENCES public.users(id),
  deleted_at TIMESTAMPTZ
);
