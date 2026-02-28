# Runbook — Vendor Profiles (Molam Eats)

## Overview
- Allows PRO & Enterprise vendors to create multiple profiles (Admin, Manager, etc.).
- Profiles are linked to Molam ID for authentication.
- Strict RBAC enforced by role assignment and JWT checks.

## Common Ops Tasks
- **List all profiles for a vendor**:
  ```sql
  SELECT * FROM vendor_profiles_eats WHERE vendor_id = '...';
  ```

- **Deactivate profile**:
  ```sql
  UPDATE vendor_profiles_eats SET active = false WHERE id = '...';
  ```

- **Audit logs**:
  Enabled by FATIMA (check scoring tables and vendor risk traces).

## Alerts
- High creation rate of profiles in short time → potential abuse.
- FATIMA flag raised on suspicious vendor activity.

## Recovery
- If migration fails: rollback with:
  ```bash
  yarn typeorm migration:revert
  ```
