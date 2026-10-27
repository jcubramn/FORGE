# Forge

A personalized workout planner and training log built by Jacob Ramón using AI-assisted development.

## Features
- Structured intake covering goals, experience, equipment, weekdays, session length, and movement restrictions.
- Rules-based training plans with exercise selection, set and rep targets, RPE, deloads, and cardio progression.
- Workout history, weight tracking, and nutrition estimates.
- Check-ins that compare logged lifts and weight trends, with recovery and pain gates and a cooldown between nutrition adjustments.
- Optional Supabase Google sign-in and account synchronization; the included configuration starts in local browser preview mode.

## Run
Node.js 20 or newer. No package installation is required for the core application.

```sh
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173. Browser-local preview data stays on that device. To enable cloud accounts, configure your own Supabase project, OAuth, `forge_accounts` schema and row-level security policies, then set `supabaseUrl` and `supabasePublishableKey` in `config.js`. No production connection is included.

## Verification
17 Node.js tests cover intake validation, nutrition math, schedules, equipment restrictions, deloads, progression, and check-in logic.

## Boundaries
The coach is rules-based; there is no conversational AI service. It does not diagnose injuries or interpret free-text medical restrictions. Training restrictions must be entered with explicit controls. Nutrition outputs are estimates, not medical advice. The code preserves checks for adult eligibility and supported input ranges.

## Source snapshot
Current application source with empty cloud configuration. Private environment files, production identifiers, and personal workout records are excluded. Supabase browser-library licensing is preserved in `vendor/`.
