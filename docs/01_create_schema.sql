
-- -------------------------------------------
-- 01_create_schema.sql - Initial schema
-- -------------------------------------------
-- Example schema for the main fuel station entities

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS pumps (
  id UUID PRIMARY KEY,
  station_id UUID REFERENCES stations(id),
  label TEXT NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS nozzles (
  id UUID PRIMARY KEY,
  pump_id UUID REFERENCES pumps(id),
  label TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  initial_reading NUMERIC,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY,
  station_id UUID REFERENCES stations(id),
  nozzle_id UUID REFERENCES nozzles(id),
  fuel_type TEXT NOT NULL,
  litres NUMERIC,
  amount NUMERIC,
  price_per_litre NUMERIC,
  sale_datetime TIMESTAMPTZ,
  source TEXT,
  entered_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ
);

