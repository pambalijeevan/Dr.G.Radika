# Dr. G. Radhika — Academic Portfolio

A responsive React + Vite academic portfolio with a cinematic navy-and-teal visual identity, animated details, editable career sections, a separate `/admin` route, Supabase sign-in, profile/college-logo uploads, and PDF resource uploads.

## Before publishing

1. Follow `SETUP.md` to create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create one administrator under Supabase Authentication → Users, then add that user's UUID to `public.portfolio_admins` as described in `SETUP.md`.
4. Add the Supabase URL and publishable/anon key to `.env`.
5. Run `npm install` and `npm run dev`.
6. Deploy to Netlify with build command `npm run build` and publish directory `dist`.

The public portfolio does not expose an admin link. Once deployed, open `https://YOUR-SITE.netlify.app/admin` directly to sign in. Qualifications, experience, achievements, publications, contact information and social links must be filled with verified details through the admin content editor. No personal details or photo have been invented.
