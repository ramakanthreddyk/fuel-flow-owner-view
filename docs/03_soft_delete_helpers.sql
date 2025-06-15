
-- -------------------------------------------
-- 03_soft_delete_helpers.sql - Utility functions, soft delete migration, tips
-- -------------------------------------------

-- === Add deleted_at columns (useful for migrations if fields missing) ===
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE stations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE pumps ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE nozzles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- === Soft delete and restore helpers (examples) ===

-- Soft delete a record
-- UPDATE <table> SET deleted_at = NOW() WHERE id = '...';

-- Restore a soft deleted record
-- UPDATE <table> SET deleted_at = NULL WHERE id = '...';

-- Query active records only:
-- SELECT * FROM <table> WHERE deleted_at IS NULL;

-- Optionally: Create a view for active stations as an example
-- CREATE OR REPLACE VIEW active_stations AS SELECT * FROM stations WHERE deleted_at IS NULL;

-- Optionally: Add triggers, cleanup routines, etc. as needed.
