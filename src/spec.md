# Specification

## Summary
**Goal:** Add a backend-enforced first-login owner/admin pattern (single permanent owner) with frontend visibility via Internet Identity, plus a consistent non-blue/non-purple UI theme for the status area.

**Planned changes:**
- Backend (single Motoko actor): persist an `owner/admin` principal that is set exactly once by the first authenticated caller via a safe initialization pathway, and cannot be overwritten/cleared by non-owner calls or later logins.
- Backend APIs: add read methods to (1) fetch current owner/admin (optional if uninitialized) and (2) return whether the caller is the owner/admin; add an idempotent initialization call or implicit initialization on first protected action.
- Backend authorization: enforce owner/admin checks in relevant update methods; reject non-owner calls to admin-only methods with a clear error.
- Frontend: integrate with existing Internet Identity flow to display connected principal, current owner/admin value (or uninitialized state), and a backend-derived “is owner/admin” status.
- Frontend UI: apply a coherent creative visual theme (colors/typography/spacing/component styling) across the owner/admin status UI, avoiding blue/purple as primary brand colors.

**User-visible outcome:** After signing in, users can see their connected principal and whether they are the permanent owner/admin (based on backend state). On fresh deployments, the UI indicates that the first authenticated user becomes the owner/admin, and any admin-only actions are enforced by the backend (non-owners are rejected).
