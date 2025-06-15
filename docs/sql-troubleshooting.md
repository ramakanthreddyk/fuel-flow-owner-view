
# SQL Troubleshooting for FuelSync (Supabase Migrations)

## Background

During our recent setup and migration for FuelSync, several issues arose stemming from the handling of SQL migrations around users, roles, and Supabase triggers. Here is a summary of the main issues and solutions for reference.

---

## 1. Role Backfill Issue (`profiles` table)

**Problem:**  
Upon importing historical users into the `profiles` table, all imported users were set with a default role of `owner`, including users who should have been `superadmin` or `employee`.

**Why?**  
The backfill SQL migration used:
```sql
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
```
This assigned every backfilled user the same role regardless of their intended permissions.

**Solution:**  
A correction SQL script was run to update the specific user's role:
```sql
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'superadmin@fuelsync.com';
```
**Tip:** Review imported users and update their roles as needed after importing historical data. Do not rely on a single default value.

---

## 2. User Profile Table Structure

**Problem:**  
Some application logic depended on roles and user metadata being available in the `profiles` table, but the application also supported roles in other tables (like `users`). This led to confusion over which role source should be authoritative.

**Solution:**  
- Ensure that the `profiles` table is always the single source of truth for user role for the frontend.
- Make sure migrations only update ONE table for roles to avoid confusion.

---

## 3. Triggers/Functions Out-of-Sync

**Problem:**  
Triggers meant to keep `profiles` and/or `users` in sync could lag or fail, leading to missing or outdated records if users preexisted before the triggers were installed.

**Solution:**  
- After creating/revising triggers/functions, always backfill missing rows or fix user roles via targeted SQL updates.
- Review missing users with a query like:
  ```sql
  SELECT * FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);
  ```

---

## General Recommendations

- After any user, user role, or profile migration, **audit your key user tables** for missing users or unexpected default values.
- Avoid using static default roles except for onboarding new users.
- Always verify triggers are attached and run on the right events/tables.
- Document any manual corrections made after a migration for transparency.

---

**Date:** 2025-06-15  
**Maintainer:** Lovable AI

