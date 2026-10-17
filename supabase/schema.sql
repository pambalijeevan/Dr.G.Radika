-- Run this script in Supabase Dashboard > SQL Editor.
-- The portfolio is publicly readable; only signed-in users can publish content.
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Explicit allow-list: only users listed here may change portfolio content.
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_admins enable row level security;
drop policy if exists "Authenticated users can read admin allow-list" on public.portfolio_admins;
create policy "Authenticated users can read admin allow-list"
  on public.portfolio_admins for select to authenticated using (true);

drop policy if exists "Public can read portfolio content" on public.site_content;
create policy "Public can read portfolio content"
  on public.site_content for select using (true);

drop policy if exists "Authenticated admins can publish portfolio content" on public.site_content;
drop policy if exists "Allow-listed admins can insert portfolio content" on public.site_content;
drop policy if exists "Allow-listed admins can update portfolio content" on public.site_content;
drop policy if exists "Allow-listed admins can delete portfolio content" on public.site_content;
create policy "Allow-listed admins can insert portfolio content"
  on public.site_content for insert to authenticated
  with check (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));
create policy "Allow-listed admins can update portfolio content"
  on public.site_content for update to authenticated
  using (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));
create policy "Allow-listed admins can delete portfolio content"
  on public.site_content for delete to authenticated
  using (exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));

insert into public.site_content (id, content)
values ('main', '{
  "profile": {
    "name": "Dr. G. Radhika",
    "role": "Lecturer in Computers",
    "college": "GDC (A), Khairatabad",
    "location": "Hyderabad",
    "eyebrow": "ACADEMIC PORTFOLIO · COMPUTER SCIENCE",
    "headline": "Curiosity into capability.",
    "intro": "Making computer science clearer, more practical, and more connected to the world students are preparing to enter.",
    "about": "I am a Computer Science educator committed to making technical concepts understandable, practical and relevant to students. My teaching and mentoring approach connects classroom learning with hands-on activities, digital tools and career-oriented skill development.",
    "email": "",
    "phone": "",
    "photo": "",
    "collegeLogo": "",
    "socials": {"linkedin":"","youtube":"","instagram":"","website":""}
  },
  "qualifications": [],
  "experience": [],
  "achievements": [],
  "publications": [],
  "expertise": [
    {"title":"Database Systems","description":"DBMS, RDBMS, SQL, database concepts, design and practical examples.","icon":"database"},
    {"title":"Software Engineering & UML","description":"Object-oriented analysis, UML diagrams, modelling and software design.","icon":"layers"},
    {"title":"Web Technologies","description":"Web fundamentals, client-server concepts and practical development.","icon":"code"},
    {"title":"Programming","description":"Programming fundamentals, Python and problem-solving through examples.","icon":"terminal"},
    {"title":"Data Science & Analytics","description":"Data concepts, analytics, visualization and technology applications.","icon":"chart"},
    {"title":"AI & Digital Learning","description":"Exploring emerging AI tools and responsible, technology-enabled learning.","icon":"brain"}
  ],
  "courses": [
    {"title":"Fundamentals of DBMS","description":"Concepts, examples, SQL practice and review questions.","status":"In development","link":""},
    {"title":"UML & Object-Oriented Modeling","description":"Use cases, class diagrams, interactions and system design.","status":"In development","link":""},
    {"title":"Computer Science Learning Series","description":"Short, practical modules for undergraduate learners.","status":"Planned","link":""}
  ],
  "initiatives": [
    {"title":"AI & Digital Learning","description":"Helping students explore AI, digital tools and technology-enabled learning."},
    {"title":"Student Mentoring","description":"Supporting confidence, creativity, leadership and career readiness."},
    {"title":"Experiential Learning","description":"Connecting classroom concepts with workshops, projects and practical activities."}
  ],
  "resources": [
    {"title":"Lecture Notes","description":"Structured notes, definitions, diagrams and worked examples.","label":"PDF / NOTES","link":""},
    {"title":"Video Lessons","description":"Short lessons that break down difficult computer science concepts.","label":"WATCH","link":""},
    {"title":"Practice & Quizzes","description":"Exercises and questions for concept reinforcement.","label":"PRACTICE","link":""}
  ],
  "footer":"Teaching, mentoring and lifelong learning."
}'::jsonb)
on conflict (id) do nothing;

-- Create a Storage bucket for profile images:
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 26214400, array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media" on storage.objects
  for select using (bucket_id = 'portfolio-media');

drop policy if exists "Signed-in admins can upload portfolio media" on storage.objects;
drop policy if exists "Allow-listed admins can upload portfolio media" on storage.objects;
create policy "Allow-listed admins can upload portfolio media" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));

drop policy if exists "Signed-in admins can update portfolio media" on storage.objects;
drop policy if exists "Allow-listed admins can update portfolio media" on storage.objects;
create policy "Allow-listed admins can update portfolio media" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()))
  with check (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));

drop policy if exists "Signed-in admins can delete portfolio media" on storage.objects;
drop policy if exists "Allow-listed admins can delete portfolio media" on storage.objects;
create policy "Allow-listed admins can delete portfolio media" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins a where a.user_id = auth.uid()));