
-- -------------------------------------------
-- 02_seed_data.sql - Sample/seed data
-- -------------------------------------------

-- Users (Alice active, Eve soft deleted)
INSERT INTO users (id, name, email, password, role, deleted_at) VALUES
  ('00000000-0000-0000-0000-0000000000a1', 'Alice Owner', 'alice@fuel.com', 'hashed_pw', 'owner', NULL),
  ('00000000-0000-0000-0000-0000000000b1', 'Eve Employee', 'eve@fuel.com', 'hashed_pw', 'employee', NOW());

-- Stations (active, and one soft deleted)
INSERT INTO stations (id, owner_id, name, address, city, state, deleted_at) VALUES
  ('10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'Downtown Station', '101 Main St', 'Townsville', 'CA', NULL),
  ('10000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000a1', 'Closed Station', '404 Nowhere Rd', 'Ghostcity', '??', NOW());

-- Pumps
INSERT INTO pumps (id, station_id, label, deleted_at) VALUES
  ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Pump 1', NULL),
  ('20000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000a1', 'Pump 2', NOW());

-- Nozzles
INSERT INTO nozzles (id, pump_id, label, fuel_type, initial_reading, deleted_at) VALUES
  ('30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'Nozzle 1', 'petrol', 100.0, NULL),
  ('30000000-0000-0000-0000-0000000000b2', '20000000-0000-0000-0000-0000000000a1', 'Nozzle 2', 'diesel', 200.0, NOW());

-- Sales (one soft deleted, one active)
INSERT INTO sales (id, station_id, nozzle_id, fuel_type, litres, amount, price_per_litre, sale_datetime, source, entered_by, deleted_at) VALUES
  ('40000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', 'petrol', 10.0, 998.0, 99.8, NOW(), 'manual', '00000000-0000-0000-0000-0000000000a1', NULL),
  ('40000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000b2', 'diesel', 20.0, 1880.0, 94.0, NOW(), 'manual', '00000000-0000-0000-0000-0000000000b1', NOW());

