
-- ------------------------------------------
-- Soft Delete Migration & Seeding SQL
-- ------------------------------------------

-- === ALTER TABLES: add deleted_at columns ===
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE pumps ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE nozzles ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- === SEED DATA ===

-- Users (Alice active, Eve soft deleted)
insert into users (id, name, email, password, role, deleted_at)
values
  ('00000000-0000-0000-0000-0000000000a1', 'Alice Owner', 'alice@fuel.com', 'hashed_pw', 'owner', null),
  ('00000000-0000-0000-0000-0000000000b1', 'Eve Employee', 'eve@fuel.com', 'hashed_pw', 'employee', now());

-- Stations (active, and one soft deleted)
insert into stations (id, owner_id, name, address, city, state, deleted_at)
values
  ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'Downtown Station', '101 Main St', 'Townsville', 'CA', null),
  ('10000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000a1', 'Closed Station', '404 Nowhere Rd', 'Ghostcity', '??', now());

-- Pumps
insert into pumps (id, station_id, label, deleted_at)
values
  ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Pump 1', null),
  ('20000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000a1', 'Pump 2', now());

-- Nozzles
insert into nozzles (id, pump_id, label, fuel_type, initial_reading, deleted_at)
values
  ('30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'Nozzle 1', 'petrol', 100.0, null),
  ('30000000-0000-0000-0000-0000000000b2', '20000000-0000-0000-0000-0000000000a1', 'Nozzle 2', 'diesel', 200.0, now());

-- Sales (one soft deleted, one active)
insert into sales (id, station_id, nozzle_id, fuel_type, litres, amount, price_per_litre, sale_datetime, source, entered_by, deleted_at)
values
  ('40000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 'petrol', 10.0, 998.0, 99.8, now(), 'manual', '00000000-0000-0000-0000-0000000000a1', null),
  ('40000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000b2', 'diesel', 20.0, 1880.0, 94.0, now(), 'manual', '00000000-0000-0000-0000-0000000000b1', now());

-- USAGE TIP:
-- To fetch only non-deleted (active) records, always add: WHERE deleted_at IS NULL
