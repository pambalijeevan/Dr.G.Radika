# Dr. G. Radhika — Academic Portfolio

A responsive React + Vite portfolio with a private admin login, editable site content, and profile-image uploads. Supabase stores content so publishing in the admin dashboard updates the public website without rebuilding the frontend.

## Stack

- React + Vite
- Supabase Auth (private admin sign-in)
- Supabase Postgres (portfolio content)
- Supabase Storage (profile photo, college logo and PDF lecture resources)
- Netlify or Vercel free static hosting

## Run locally

1. Install Node.js LTS from https://nodejs.org/
2. Extract this project ZIP.
3. Open a terminal inside the extracted `radhika-academic-portfolio` folder.
4. Run:

   ```bash
   npm install
   ```

5. Create a Supabase project at https://supabase.com/
6. In Supabase, open **Project Settings → API** and copy the Project URL and publishable/anon key.
7. Copy `.env.example` to a new file named `.env` and fill in the values:

   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ```

   The frontend publishable/anon key is designed for browser use; database access must be controlled by Row Level Security. Never put a Supabase service-role key in this project.

8. In Supabase **SQL Editor**, run all of `supabase/schema.sql`.
9. In Supabase **Authentication → Users**, create the administrator user manually. Do not enable public sign-ups. Use a strong, unique password.
10. Copy the new user's UUID from Authentication → Users, then run this SQL in SQL Editor (replace the example UUID):

   ```sql
   insert into public.portfolio_admins (user_id)
   values ('PASTE-ADMIN-USER-UUID-HERE')
   on conflict (user_id) do nothing;
   ```

   This allow-list is important: merely having an authenticated account does not grant permission to publish.
11. Run:

    ```bash
    npm run dev
    ```

12. Open the local URL printed by Vite, normally `http://localhost:5173`.

## How the admin dashboard works

- Open the separate `/admin` URL on your deployed domain (for example, `https://your-site.netlify.app/admin`). It is not linked from the public navigation.
- Sign in with the account you created privately in Supabase.
- The editor currently exposes the content as JSON. Change text and arrays while preserving valid JSON syntax.
- Click **Publish changes** to save the data to Supabase. The public page reads the published content from the database.
- Upload a profile image using the upload control. Then click **Publish changes**.
- Courses and resource links are editable in the same JSON content. Keep links blank until you have a real URL to add.

### Security notes

- Public visitors can read portfolio content and images.
- Only user IDs explicitly listed in `public.portfolio_admins` can write content or upload media.
- Keep public sign-ups disabled in Supabase so visitors cannot create accounts through the site.
- Never put a Supabase service-role key in the frontend.
- Do not publish private student records, phone numbers, personal data, or copyrighted teaching material without permission.

## Deploy for a public URL (free tier)

### Netlify

1. Push the project to a GitHub repository, or upload the project through Netlify's deployment workflow.
2. In Netlify, create a new site from the repository.
3. Set the build command to `npm run build` and publish directory to `dist`.
4. Under **Site configuration → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Netlify gives you a public `*.netlify.app` URL.
6. Whenever you change the React source, push to GitHub and Netlify rebuilds the site. Changes made through the admin dashboard are saved directly to Supabase and appear on the public site without redeploying.

Official links:
- Netlify: https://www.netlify.com/
- Supabase: https://supabase.com/
- Vite deployment guide: https://vite.dev/guide/static-deploy.html

## Project structure

```text
radhika-academic-portfolio/
├── public/
│   └── _redirects
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── supabase/
│   └── schema.sql
├── .env.example
├── index.html
├── package.json
└── SETUP.md
```

## Important

The included admin panel is real UI code, but online login and live publishing remain inactive until you create a Supabase project, run the SQL setup, and add the environment variables. This ZIP does not come with a hosted public URL because it needs your own hosting and database accounts.
