
# Data Entry Module Documentation

## Table of Contents

1. [Overview](#overview)
2. [For Developers](#for-developers)
   - [Architecture](#architecture)
   - [Key Components & Hooks](#key-components--hooks)
   - [Data Flow](#data-flow)
   - [Adding Features & Extending](#adding-features--extending)
   - [Error/Loading States](#errorloading-states)
3. [For Users](#for-users)
   - [Step-by-Step User Flow](#step-by-step-user-flow)
   - [Required Permissions](#required-permissions)
   - [Error Handling](#error-handling)
4. [Further Improvements](#further-improvements)
5. [SQL Seed Data Example](#sql-seed-data-example)

---

## Overview

This module enables Owners to enter manual fuel sales and tank readings quickly and reliably. The UI provides contextual drill-down: Station → Pump → Nozzle, then allows for rapid entry and preview of calculated sales data.

---

## For Developers

### Architecture

- **React** components for UI, all state/async handled with hooks.
- **Supabase** as backend for data (tables: stations, pumps, nozzles, manual_readings, sales).
- Components are modular: each selection/input unit is its own file.
- All field interactions provide error and loading feedback.

### Key Components & Hooks

- `StationSelector`: Fetches stations for current owner (`created_by` = user.id).
- `PumpList`: Lists pumps for selected station.
- `NozzleInput`: Shows available nozzles for pump, latest reading, reading input field.
- `SalePreview`: Shows a real-time calculation of “Sale Volume”, Price, Amount.
- `useManualEntryData.ts`: Contains hooks for all Supabase CRUD/data.
- Async actions through Supabase client and [@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview).

### Data Flow

1. **Load**: Query current user's stations.
2. **Select Station**: Loads associated pumps.
3. **Select Pump**: Loads associated nozzles.
4. **Select Nozzle**: Loads last reading and latest price.
5. **Input Reading**: Form checks all required fields.
6. **Preview Sale**: Auto-calculates sale if previous reading & price are available.
7. **Submit**: Writes reading, writes sales record if a sale is detected.

### Adding Features & Extending

To add more logic (e.g. edit past entries, ocr upload, multi-nozzle forms, etc):

- Create corresponding, focused files under `/src/pages/data-entry`.
- Add new hooks, e.g. `useEditManualEntry`.
- Reuse modular components where possible.
- Ensure Supabase table changes are reflected in TypeScript types and queries.
- Always provide user feedback (success/failure).

### Error/Loading States

- Every form and fetch has explicit loading & error messages.
- All input fields have validation; submit buttons disable while async actions run.

---

## For Users

### Step-by-Step User Flow

1. **Station Selection**: Pick your station (only your stations will be listed).
2. **Pump Selection**: Pick the relevant pump for the operation.
3. **Nozzle & Reading Input**: 
    - Pick nozzle, see last reading.
    - Enter the new reading value.
4. **Sale Preview**: System instantly computes potential sale info.
5. **Submit**: If all input is valid, submit. You'll see confirmation and errors if any.

### Required Permissions

- Only station owners (created_by matches your account) see and can enter data for their stations.
- Employees could be supported by modifying queries to match assigned user-station mappings.

### Error Handling

- Any missing fields or query failures show a clear error message and prevent accidental submission.
- Only valid deltas (increases in reading) are used for draft sales.

---

## Further Improvements

- **Bulk Entry**: Allow owner to import CSV or submit readings for multiple nozzles in one form.
- **Role-Based Views**: Add UI/logic for employees assigned by owner, not just `created_by`.
- **Past Entry Editing**: Enable manual edits or corrections for previous sales/readings.
- **Advanced Audit Logging**: Log every data-modifying action for traceability.
- **Push Notifications**: Notify users/managers on anomalous readings or detected issues.
- **Mobile UI**: Enhance touch input support and QR code scanning for nozzle/pump.
- **Unit Tests**: Add tests for all hooks and components using React Testing Library.

---

## SQL Seed Data Example

You can use the following SQL commands to populate your dev database for testing:

```sql
-- INSERT USERS
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', 'owner@example.com', '{"name":"Owner User"}');

-- INSERT STATIONS
insert into public.stations (id, name, address, created_by) values
  ('11111111-1111-1111-1111-111111111111', 'Main St Station', '123 Main St', '00000000-0000-0000-0000-000000000001');

-- INSERT PUMPS
insert into public.pumps (id, station_id, label) values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Pump 1');

-- INSERT NOZZLES
insert into public.nozzles (id, pump_id, label, fuel_type) values
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Nozzle 1', 'petrol'),
  ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222222', 'Nozzle 2', 'diesel');

-- INSERT FUEL PRICES
insert into public.fuel_prices (id, station_id, fuel_type, price) values
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'petrol', 102.45),
  ('44444444-4444-4444-4444-444444444445', '11111111-1111-1111-1111-111111111111', 'diesel', 91.30);

-- INSERT MANUAL READING & SALE
insert into public.manual_readings (id, station_id, nozzle_id, cumulative_volume, recorded_at) values
  ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1200, now());

insert into public.sales (id, station_id, nozzle_id, user_id, recorded_at, cumulative_reading, previous_reading, sale_volume, fuel_price, amount, status) values
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', now(), 1200, 1000, 200, 102.45, 20490, 'draft');
```

---

For any further improvements, see the section above and create feature-specific files/commits for best maintainability!
