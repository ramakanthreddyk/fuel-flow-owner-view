
# Soft Delete Strategy Documentation

## Overview

For the following entities:
- `users`
- `stations`
- `pumps`
- `nozzles`
- `sales`

We use a **soft delete** field, `deleted_at TIMESTAMPTZ`, to record when a record is logically deleted (instead of being physically removed from the database).

## How it works

- To **soft delete** a row, set `deleted_at` to the current timestamp (`NOW()`).
- To **restore** a soft-deleted row, set `deleted_at` back to `NULL`.
- All queries for *active* records should filter by `WHERE deleted_at IS NULL`.

## Example: Soft deleting a user

```sql
UPDATE users SET deleted_at = NOW() WHERE id = '...';
```

## Example: Querying only active stations

```sql
SELECT * FROM stations WHERE deleted_at IS NULL;
```

## Advantages

- **Auditability**: Know who/when performed a delete.
- **Reversibility**: Records can be restored if deleted accidentally.
- **Data Integrity**: Referential checks remain possible for related data.

## Practical Recommendations

- On "delete" actions in your app, issue an update to set `deleted_at`, not a delete command.
- **Never** permanently delete unless specifically required (e.g., by law).
- You may want to create triggers for automated cleanup, e.g., only purge records older than X days if needed.

