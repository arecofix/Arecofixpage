# Supabase Security Fixes Guide

This document outlines the steps to resolve the security warnings that cannot be fixed via code migrations. You must apply these changes manually in your Supabase Project Dashboard.

## 1. Reduce OTP Expiry (Critical)
**Issue:** OTP expiry is set to more than 1 hour (3600 seconds).
**Recommendation:** Set to 10-15 minutes (600-900 seconds).

**Steps:**
1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Navigate to **Authentication** (icon looks like a lock/user) in the left sidebar.
5.  Select **Email**.
4.  Click on **Providers** under Configuration.
6.  Scroll down to **OTP Expiry**.
7.  Change the value to `600` (for 10 minutes) or `900` (for 15 minutes).
8.  Click **Save**.

## 2. Enable Leaked Password Protection
**Issue:** Users can sign up with compromised passwords.

**Steps:**
1.  Navigate to **Authentication** > **Security** (under Configuration).
2.  Find the **Password Protection** section.
3.  Toggle **Enable Leaked Password Protection** to **ON**.
    *   *Note: This checks passwords against HaveIBeenPwned.org.*
4.  Click **Save**.

## 3. Upgrade Postgres Version
**Issue:** Outstanding security patches available.

**Steps:**
1.  Navigate to **Settings** (cogwheel icon) > **Infrastructure**.
2.  Look for the **Database Version** section.
3.  If an update is available, you will see an **Upgrade** button.
4.  Click **Upgrade**.
    *   *Warning: This may cause a few seconds of downtime. Perform during low-traffic periods if possible.*

## 4. Verify RLS Optimization
**Issue:** RLS policies were re-evaluating `auth.uid()` too frequently.
**Status:** **FIXED** via migration `20251130_optimize_rls.sql`.
**Action:** Ensure you have run the migration in the SQL Editor.
