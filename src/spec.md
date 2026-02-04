# Specification

## Summary
**Goal:** Implement an MVP “Service Request/Permintaan” flow so Clients can submit requests tied to their active subscription’s assigned Asistenmu, and both roles can manage the request through a minimal lifecycle.

**Planned changes:**
- Add a backend Service Request domain model persisted in canister state, including request fields (title/details/deadline), derived Asistenmu assignment, timestamps, status, and optional review link / revision details.
- Enforce backend assignment resolution from the Client’s active subscription (reject request creation when no active subscription or no assigned Asistenmu).
- Implement backend query/mutation APIs with role-based authorization for Client (create, list, request revision, complete) and Asistenmu (list assigned, update status, set/clear review link), including valid state transitions.
- Add a backend endpoint for Clients to query subscription/service summary (total count, active count, and whether an active subscription has an assigned Asistenmu) to gate the “Buat Permintaan” CTA.
- Build Client Dashboard UI with tabs: Delegating Request, In Progress, Client Review Requested (clickable link + CTAs), Revising (Please Wait), Completed; plus a Create Request form (Title, Details, optional Deadline).
- Build Asistenmu Dashboard UI with a “New Client Requests” tab showing assigned requests and a status dropdown (In Progress / Request Client Review) that reveals a Google Drive link input when requesting review.
- Add/extend centralized React Query hooks for all request queries/mutations and invalidate relevant queries so requests move between tabs after actions.
- Add frontend routes for /client and /asistenmu dashboards and navigation/redirect behavior based on authenticated user role (without modifying immutable auth-related files).

**User-visible outcome:** Clients can create a request (only when they have an active subscription), track it across dashboard tabs, open the review link, request a revision with required details, or complete the request with confirmation; Asistenmu can see assigned incoming requests, move them to “In Progress” or “Request Client Review,” and attach a Google Drive link for client review.
