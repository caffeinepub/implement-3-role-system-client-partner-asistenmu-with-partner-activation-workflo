# Specification

## Summary
**Goal:** Standardize the app’s header appearance with a translucent white + blur style, ensure the landing hero headline wraps into exactly two lines with the requested casing, and restore correct Internet Identity (II) login behavior for all “Masuk” buttons.

**Planned changes:**
- Update the Landing page and all dashboard headers (Admin, Client, Asistenmu, Partner) to be sticky with a translucent white background, subtle bottom divider, and backdrop blur (no heavy shadow).
- Adjust the Landing page hero headline copy and typography so it displays as exactly two lines:
  - Line 1: "Tenang menjalani hari,"
  - Line 2: "Didampingi oleh Asistenmu dengan rapi."
  and reduce font size to prevent unintended wrapping beyond the explicit line break.
- Fix all “Masuk”/login buttons across the app to correctly trigger the existing Internet Identity login flow (without modifying immutable authentication hook files) and add proper loading/disabled handling to prevent double-click login issues.

**User-visible outcome:** Headers look consistently translucent and readable while scrolling, the landing hero headline appears as the requested two-line text, and every “Masuk” button reliably logs the user in via Internet Identity and continues with the existing role-based routing.
