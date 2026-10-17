import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, Check,
  Code2, ExternalLink, GraduationCap, Layers3, LogIn, LogOut, Mail, Menu,
  Save, ShieldCheck, Sparkles, Upload, X, FileText, Award, BriefcaseBusiness, ScrollText, ImagePlus
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const initialContent = {
  profile: {
    name: 'Dr. G. Radhika',
    role: 'Lecturer in Computers',
    college: 'GDC (A), Khairatabad',
    location: 'Hyderabad',
    eyebrow: 'ACADEMIC PORTFOLIO · COMPUTER SCIENCE',
    headline: 'Curiosity into capability.',
    intro: 'Making computer science clearer, more practical, and more connected to the world students are preparing to enter.',
    about: 'I am a Computer Science educator committed to making technical concepts understandable, practical and relevant to students. My teaching and mentoring approach connects classroom learning with hands-on activities, digital tools and career-oriented skill development.',
    email: '',
    phone: '',
    photo: '',
    collegeLogo: '',
    socials: { linkedin: '', youtube: '', instagram: '', website: '' }
  },
  qualifications: [],
  experience: [],
  achievements: [],
  publications: [],
  expertise: [
    { title: 'Database Systems', description: 'DBMS, RDBMS, SQL, database concepts, design and practical examples.', icon: 'database' },
    { title: 'Software Engineering & UML', description: 'Object-oriented analysis, UML diagrams, modelling and software design.', icon: 'layers' },
    { title: 'Web Technologies', description: 'Web fundamentals, client-server concepts and practical development.', icon: 'code' },
    { title: 'Programming', description: 'Programming fundamentals, Python and problem-solving through examples.', icon: 'terminal' },
    { title: 'Data Science & Analytics', description: 'Data concepts, analytics, visualization and technology applications.', icon: 'chart' },
    { title: 'AI & Digital Learning', description: 'Exploring emerging AI tools and responsible, technology-enabled learning.', icon: 'brain' }
  ],
  courses: [
    { title: 'Fundamentals of DBMS', description: 'Concepts, examples, SQL practice and review questions.', status: 'In development', link: '' },
    { title: 'UML & Object-Oriented Modeling', description: 'Use cases, class diagrams, interactions and system design.', status: 'In development', link: '' },
    { title: 'Computer Science Learning Series', description: 'Short, practical modules for undergraduate learners.', status: 'Planned', link: '' }
  ],
  initiatives: [
    { title: 'AI & Digital Learning', description: 'Helping students explore AI, digital tools and technology-enabled learning.' },
    { title: 'Student Mentoring', description: 'Supporting confidence, creativity, leadership and career readiness.' },
    { title: 'Experiential Learning', description: 'Connecting classroom concepts with workshops, projects and practical activities.' }
  ],
  resources: [
    { title: 'Lecture Notes', description: 'Structured notes, definitions, diagrams and worked examples.', label: 'PDF / NOTES', link: '' },
    { title: 'Video Lessons', description: 'Short lessons that break down difficult computer science concepts.', label: 'WATCH', link: '' },
    { title: 'Practice & Quizzes', description: 'Exercises and questions for concept reinforcement.', label: 'PRACTICE', link: '' }
  ],
  customSections: [],
  footer: 'Teaching, mentoring and lifelong learning.'
};

const iconMap = { database: Layers3, layers: Layers3, code: Code2, terminal: Code2, chart: BookOpen, brain: BrainCircuit };

function readLocal() {
  try {
    const saved = localStorage.getItem('radhika-portfolio-preview');
    return saved ? JSON.parse(saved) : initialContent;
  } catch { return initialContent; }
}

function App() {
  const [content, setContent] = useState(readLocal);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [user, setUser] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [editJson, setEditJson] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('profile');
  const [editError, setEditError] = useState('');
  const [notice, setNotice] = useState('');
  const [uploadBusy, setUploadBusy] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.from('site_content').select('content').eq('id', 'main').maybeSingle()
      .then(({ data, error }) => {
        if (active && data?.content) setContent({ ...initialContent, ...data.content });
        if (active && error) console.error(error.message);
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const nav = [
    ['About', '#about'], ['Teaching', '#teaching'], ['Courses', '#courses'],
    ['Initiatives', '#initiatives'], ['Career', '#career'], ['Publications', '#publications'], ['Resources', '#resources'],
    ...(content.customSections || []).map(section => [section.title, `#${section.id}`])
  ];

  function openAdmin() {
    setEditError('');
    setNotice('');
    setAdminOpen(true);
  }

  async function signIn(event) {
    event.preventDefault(); setAuthError(''); setAuthBusy(true);
    if (!supabase) {
      setAuthError('Connect Supabase first. Follow SETUP.md, then restart the development server.');
      setAuthBusy(false); return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    else { setNotice('Signed in. Your private editor is ready.'); }
    setAuthBusy(false);
  }

  async function saveContent() {
    setEditError(''); setNotice('');
    if (!content.profile?.name || !content.profile?.role) {
      setEditError('Please keep the profile name and role fields.'); return;
    }
    if (!supabase || !user) {
      setEditError('Sign in to the connected Supabase admin account to publish changes.');
      return;
    }
    const { error } = await supabase.from('site_content').upsert({
      id: 'main', content, updated_at: new Date().toISOString()
    });
    if (error) { setEditError(error.message); return; }
    setNotice('Published! Your public portfolio now uses the updated content.');
  }

  function updateProfile(field, value) {
    setContent(current => ({ ...current, profile: { ...current.profile, [field]: value } }));
  }

  function updateListItem(listName, index, field, value) {
    setContent(current => {
      const list = [...(current[listName] || [])];
      list[index] = { ...(list[index] || {}), [field]: value };
      return { ...current, [listName]: list };
    });
  }

  function addListItem(listName, template) {
    setContent(current => ({ ...current, [listName]: [...(current[listName] || []), { ...template }] }));
  }

  function deleteListItem(listName, index) {
    setContent(current => ({ ...current, [listName]: (current[listName] || []).filter((_, i) => i !== index) }));
  }

  function addCustomSection() {
    setContent(current => ({ ...current, customSections: [...(current.customSections || []), { id: `section-${Date.now()}`, title: 'New section', description: '', items: [] }] }));
    setActiveAdminTab('customSections');
  }

  function updateCustomSection(index, field, value) {
    setContent(current => {
      const sections = [...(current.customSections || [])];
      sections[index] = { ...sections[index], [field]: value };
      return { ...current, customSections: sections };
    });
  }

  function deleteCustomSection(index) {
    setContent(current => ({ ...current, customSections: (current.customSections || []).filter((_, i) => i !== index) }));
  }

  async function uploadImage(event, target) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!supabase || !user) { setEditError('Sign in to the admin dashboard before uploading media.'); return; }
    if (!file.type.startsWith('image/')) { setEditError('Choose an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setEditError('Choose an image smaller than 5 MB.'); return; }
    setUploadBusy(true); setEditError(''); setNotice('');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const targetLabel = target.type === 'profile' ? target.field : target.type === 'customSection' ? `custom-section-${target.sectionIndex}` : `${target.listName || 'custom'}-${target.index ?? target.sectionIndex}-${target.itemIndex ?? ''}`;
    const path = `images/${user.id}-${targetLabel}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type });
    if (uploadError) { setEditError(uploadError.message); setUploadBusy(false); event.target.value = ''; return; }
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    const imageUrl = data.publicUrl;
    if (target.type === 'profile') {
      setContent(current => ({ ...current, profile: { ...current.profile, [target.field]: imageUrl } }));
      setNotice(`${target.field === 'photo' ? 'Profile photo' : 'College logo'} uploaded. Click “Publish changes” to make it live.`);
    } else if (target.type === 'list') {
      updateListItem(target.listName, target.index, 'image', imageUrl);
      setNotice('Image uploaded to this item. Click “Publish changes” to make it live.');
    } else if (target.type === 'customSection') {
      setContent(current => {
        const sections = [...(current.customSections || [])];
        sections[target.sectionIndex] = { ...sections[target.sectionIndex], image: imageUrl };
        return { ...current, customSections: sections };
      });
      setNotice('Section image uploaded. Click “Publish changes” to make it live.');
    } else if (target.type === 'custom') {
      setContent(current => {
        const sections = [...(current.customSections || [])];
        const section = { ...sections[target.sectionIndex] };
        const items = [...(section.items || [])];
        items[target.itemIndex] = { ...(items[target.itemIndex] || {}), image: imageUrl };
        section.items = items;
        sections[target.sectionIndex] = section;
        return { ...current, customSections: sections };
      });
      setNotice('Image uploaded to this entry. Click “Publish changes” to make it live.');
    }
    setUploadBusy(false); event.target.value = '';
  }

  async function uploadResource(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!supabase || !user) { setEditError('Sign in to the admin dashboard before uploading resources.'); return; }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) { setEditError('Please choose a PDF lecture note or resource.'); return; }
    if (file.size > 25 * 1024 * 1024) { setEditError('Choose a PDF smaller than 25 MB.'); return; }
    setUploadBusy(true); setEditError(''); setNotice('');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `resources/${user.id}-${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: 'application/pdf' });
    if (uploadError) { setEditError(uploadError.message); setUploadBusy(false); return; }
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    const next = { ...content, resources: [...(content.resources || []), { title: file.name.replace(/\.pdf$/i, ''), description: 'PDF learning resource', label: 'PDF / NOTES', link: data.publicUrl }] };
    setContent(next);
    setNotice('PDF uploaded and added to resources. Click “Publish changes” to make it live.');
    setUploadBusy(false); event.target.value = '';
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setUser(null); setNotice('Signed out.');
  }

  const isConfigured = Boolean(supabase);
  const skills = useMemo(() => content.expertise || [], [content.expertise]);
  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

  // Dedicated admin URL; it is not linked from the public portfolio.
  if (isAdminRoute) {
    return (
      <div className="admin-page">
        <div className="admin-page-top">
          <a className="brand" href="/"><span className="brand-mark">R<span>.</span></span><span className="brand-text">{content.profile.name}<small>PORTFOLIO ADMINISTRATION</small></span></a>
          <a className="admin-back-link" href="/">← View public website</a>
        </div>
        <main className="admin-page-main">
          <div className="section-marker"><span>PRIVATE</span> ADMINISTRATOR AREA</div>
          <h1 className="admin-page-title">{user ? 'Manage your website.' : 'Administrator sign in.'}</h1>
          <p className="admin-page-intro">Sign in with the private administrator account to update the public academic portfolio.</p>
          {!isConfigured && <div className="notice notice-warn">Admin login is not active yet. Complete the Supabase setup in SETUP.md and configure the environment variables.</div>}
          {!user ? (
            <form className="login-form admin-login-card" onSubmit={signIn}>
              <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin email address"/></label>
              <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/></label>
              {authError && <p className="form-error">{authError}</p>}
              <button className="button button-dark" disabled={authBusy}>{authBusy ? 'Signing in…' : 'Sign in securely'} <LogIn size={16}/></button>
              <p className="form-hint">There is no public registration. Create the admin account privately in Supabase.</p>
            </form>
          ) : (
            <div className="admin-page-editor">
              <div className="admin-user"><ShieldCheck size={18}/><span>Signed in as {user.email}</span><button onClick={signOut}><LogOut size={14}/> Sign out</button></div>
              <div className="admin-workspace">
                <aside className="admin-sidebar">
                  <div className="admin-sidebar-label">WEBSITE CONTENT</div>
                  {[
                    ['profile','Profile & contact'],['qualifications','Education'],['experience','Experience'],['expertise','Teaching expertise'],['courses','Courses'],['initiatives','Initiatives'],['achievements','Achievements'],['publications','Publications'],['resources','Resources'],['customSections','Custom sections']
                  ].map(([key,label]) => <button key={key} className={activeAdminTab === key ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveAdminTab(key)}>{label}<span>{key === 'profile' ? 'Edit' : key === 'customSections' ? (content.customSections || []).length : (content[key] || []).length}</span></button>)}
                  <button className="admin-tab add-section-tab" onClick={addCustomSection}><span>＋ Create a section</span></button>
                </aside>
                <div className="admin-editor-panel">
                  <div className="admin-panel-heading"><div><span className="admin-eyebrow">EDIT WEBSITE</span><h2>{({profile:'Profile & contact',qualifications:'Education & qualifications',experience:'Professional experience',expertise:'Teaching expertise',courses:'Courses & learning',initiatives:'Initiatives',achievements:'Achievements & awards',publications:'Publications',resources:'Learning resources',customSections:'Custom sections'})[activeAdminTab]}</h2><p>Changes stay in draft until you publish them.</p></div><button className="button button-dark" onClick={saveContent}><Save size={16}/> Publish changes</button></div>
                  {activeAdminTab === 'profile' && <div className="admin-form-grid">
                    {[
                      ['name','Full name'],['role','Professional title'],['college','Institution'],['location','Location'],['eyebrow','Hero eyebrow'],['headline','Main headline'],['intro','Introduction'],['about','About text'],['email','Email address'],['phone','Phone number']
                    ].map(([key,label]) => <label key={key} className={['intro','about','headline','eyebrow'].includes(key) ? 'admin-field full' : 'admin-field'}>{label}{['intro','about'].includes(key) ? <textarea rows="4" value={content.profile[key] || ''} onChange={e => updateProfile(key,e.target.value)} /> : <input value={content.profile[key] || ''} onChange={e => updateProfile(key,e.target.value)} />}</label>)}
                    <label className="admin-field">LinkedIn URL<input value={content.profile.socials?.linkedin || ''} onChange={e => updateProfile('socials',{...(content.profile.socials || {}),linkedin:e.target.value})}/></label>
                    <label className="admin-field">YouTube URL<input value={content.profile.socials?.youtube || ''} onChange={e => updateProfile('socials',{...(content.profile.socials || {}),youtube:e.target.value})}/></label>
                    <div className="admin-media-tools"><label className="upload-button"><ImagePlus size={16}/> {uploadBusy ? 'Uploading…' : 'Upload profile photo'}<input type="file" accept="image/*" onChange={e => uploadImage(e,{type:'profile',field:'photo'})} hidden disabled={uploadBusy}/></label><label className="upload-button"><ImagePlus size={16}/> Upload college logo<input type="file" accept="image/*" onChange={e => uploadImage(e,{type:'profile',field:'collegeLogo'})} hidden disabled={uploadBusy}/></label></div>
                  </div>}
                  {['qualifications','experience','expertise','courses','initiatives','achievements','publications','resources'].includes(activeAdminTab) && <div className="admin-list-editor">
                    {(content[activeAdminTab] || []).map((item,index) => {
                      const fieldSets = {
                        qualifications:[['title','Qualification / degree'],['institution','Institution'],['year','Year'],['description','Details']],
                        experience:[['title','Role / position'],['organization','Organization'],['period','Period'],['description','Details']],
                        expertise:[['title','Topic'],['description','Description'],['icon','Icon key']],
                        courses:[['title','Course title'],['description','Description'],['status','Status'],['link','Course URL']],
                        initiatives:[['title','Initiative title'],['description','Description']],
                        achievements:[['title','Achievement / award'],['organization','Organization'],['year','Year'],['description','Details']],
                        publications:[['title','Publication title'],['authors','Authors'],['year','Year'],['publisher','Journal / publisher'],['link','Publication URL']],
                        resources:[['title','Resource title'],['description','Description'],['label','Type / label'],['link','Resource URL']]
                      };
                      return <article className="admin-item-card" key={`${activeAdminTab}-${index}`}><div className="admin-item-heading"><strong>{String(index+1).padStart(2,'0')} · {item.title || 'Untitled item'}</strong><button className="admin-delete" onClick={() => deleteListItem(activeAdminTab,index)}><X size={15}/> Delete</button></div><div className="admin-form-grid">{fieldSets[activeAdminTab].map(([field,label]) => <label key={field} className={field === 'description' ? 'admin-field full' : 'admin-field'}>{label}{field === 'description' ? <textarea rows="3" value={item[field] || ''} onChange={e => updateListItem(activeAdminTab,index,field,e.target.value)}/> : <input value={item[field] || ''} onChange={e => updateListItem(activeAdminTab,index,field,e.target.value)}/>}</label>)}</div><div className="admin-item-image-tools"><label className="upload-button"><ImagePlus size={16}/>{uploadBusy ? 'Uploading…' : item.image ? 'Replace item image' : 'Upload item image'}<input type="file" accept="image/*" onChange={e => uploadImage(e,{type:'list',listName:activeAdminTab,index})} hidden disabled={uploadBusy}/></label>{item.image && <><img className="admin-image-preview" src={item.image} alt="Item preview"/><button className="admin-delete" onClick={() => updateListItem(activeAdminTab,index,'image','')}>Remove image</button></>}</div></article>;
                    })}
                    <button className="admin-add-button" onClick={() => addListItem(activeAdminTab,({qualifications:{title:'',institution:'',year:'',description:''},experience:{title:'',organization:'',period:'',description:''},expertise:{title:'',description:'',icon:'code'},courses:{title:'',description:'',status:'Available',link:''},initiatives:{title:'',description:''},achievements:{title:'',organization:'',year:'',description:''},publications:{title:'',authors:'',year:'',publisher:'',link:''},resources:{title:'',description:'',label:'PDF / NOTES',link:''}})[activeAdminTab])}>＋ Add {({qualifications:'education entry',experience:'experience entry',expertise:'topic',courses:'course',initiatives:'initiative',achievements:'achievement',publications:'publication',resources:'resource'})[activeAdminTab]}</button>
                    {activeAdminTab === 'resources' && <div className="admin-upload-resource"><label className="upload-button"><FileText size={16}/>{uploadBusy ? 'Uploading…' : 'Upload lecture PDF'}<input type="file" accept="application/pdf,.pdf" onChange={uploadResource} hidden disabled={uploadBusy}/></label><span>PDFs are uploaded to your existing portfolio-media storage.</span></div>}
                  </div>}
                  {activeAdminTab === 'customSections' && <div className="admin-list-editor">
                    <p className="admin-help">Create additional public sections, such as Workshops, Certifications, Research Projects or Guest Lectures. Each section can contain any number of entries.</p>
                    {(content.customSections || []).map((section,index) => <article className="admin-item-card" key={section.id || index}><div className="admin-item-heading"><strong>Custom section {index+1}</strong><button className="admin-delete" onClick={() => deleteCustomSection(index)}><X size={15}/> Delete section</button></div><div className="admin-form-grid"><label className="admin-field">Section title<input value={section.title || ''} onChange={e => updateCustomSection(index,'title',e.target.value)}/></label><label className="admin-field full">Section description<textarea rows="2" value={section.description || ''} onChange={e => updateCustomSection(index,'description',e.target.value)}/></label></div><div className="admin-item-image-tools"><label className="upload-button"><ImagePlus size={16}/>{uploadBusy ? 'Uploading…' : section.image ? 'Replace section image' : 'Upload section image'}<input type="file" accept="image/*" onChange={e => uploadImage(e,{type:'customSection',sectionIndex:index})} hidden disabled={uploadBusy}/></label>{section.image && <><img className="admin-image-preview" src={section.image} alt="Custom section preview"/><button className="admin-delete" onClick={() => updateCustomSection(index,'image','')}>Remove section image</button></>}</div><div className="admin-custom-entries">{(section.items || []).map((item,itemIndex) => <div className="admin-custom-entry" key={itemIndex}><label className="admin-field">Entry title<input value={item.title || ''} onChange={e => { const items=[...(section.items || [])]; items[itemIndex]={...items[itemIndex],title:e.target.value}; updateCustomSection(index,'items',items); }}/></label><label className="admin-field">Details<input value={item.description || ''} onChange={e => { const items=[...(section.items || [])]; items[itemIndex]={...items[itemIndex],description:e.target.value}; updateCustomSection(index,'items',items); }}/></label><label className="admin-field">Link (optional)<input value={item.link || ''} onChange={e => { const items=[...(section.items || [])]; items[itemIndex]={...items[itemIndex],link:e.target.value}; updateCustomSection(index,'items',items); }}/></label><div className="admin-item-image-tools"><label className="upload-button"><ImagePlus size={16}/>{uploadBusy ? 'Uploading…' : item.image ? 'Replace image' : 'Upload image'}<input type="file" accept="image/*" onChange={e => uploadImage(e,{type:'custom',sectionIndex:index,itemIndex})} hidden disabled={uploadBusy}/></label>{item.image && <><img className="admin-image-preview" src={item.image} alt="Entry preview"/><button className="admin-delete" onClick={() => { const items=[...(section.items || [])]; items[itemIndex]={...items[itemIndex],image:''}; updateCustomSection(index,'items',items); }}>Remove image</button></>}</div><button className="admin-delete" onClick={() => updateCustomSection(index,'items',(section.items || []).filter((_,i)=>i!==itemIndex))}>Delete entry</button></div>)}</div><button className="admin-add-button small" onClick={() => updateCustomSection(index,'items',[...(section.items || []),{title:'',description:'',link:''}])}>＋ Add entry</button></article>)}
                    <button className="admin-add-button" onClick={addCustomSection}>＋ Create another section</button>
                  </div>}
                  <div className="admin-bottom-actions"><span className="admin-help">Images are managed inside each relevant section. Profile photo and college logo are available under Profile & contact.</span><button className="button button-dark" onClick={saveContent}><Save size={16}/> Publish all changes</button></div>
                  {editError && <p className="form-error">{editError}</p>}
                </div>
              </div>
            </div>
          )}
          {notice && <p className="notice notice-success"><Check size={16}/>{notice}</p>}
          <div className="admin-page-security"><ShieldCheck size={15}/> Protected by Supabase authentication · Public visitors cannot edit content.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="site-shell">
      <div className="topline"><span>ACADEMIC PORTFOLIO</span><span>GDC (A) KHAIRATABAD <i>·</i> HYDERABAD</span></div>
      <header className="nav-wrap">
        <a className="brand" href="#home" aria-label="Home"><span className="brand-mark">{content.profile.collegeLogo ? <img className="college-logo" src={content.profile.collegeLogo} alt="College logo"/> : <>R<span>.</span></>}</span><span className="brand-text">{content.profile.name}<small>{content.profile.role}</small></span></a>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
        <nav className={mobileOpen ? 'nav-links is-open' : 'nav-links'}>
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
          <a className="nav-contact" href="#contact">Get in touch <ArrowUpRight size={15}/></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line"/> {content.profile.eyebrow}</div>
            <h1>{content.profile.headline.split(' ').slice(0, -1).join(' ')} <em>{content.profile.headline.split(' ').slice(-1)}</em></h1>
            <p className="hero-intro">{content.profile.intro}</p>
            <div className="hero-identity">
              <div className="identity-rule"/>
              <div><strong>{content.profile.name}</strong><span>{content.profile.role}</span><span>{content.profile.college} · {content.profile.location}</span></div>
            </div>
            <div className="hero-actions"><a className="button button-light" href="#teaching">Explore teaching <ArrowDownRight size={17}/></a><a className="text-link" href="#about">Discover my approach <ArrowRight size={16}/></a></div>
          </div>
          <div className="hero-art" aria-label="Abstract academic-inspired artwork">
            <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core">{content.profile.photo ? <img className="art-photo" src={content.profile.photo} alt={content.profile.name} /> : <span>G</span>}<small>COMPUTER<br/>SCIENCE</small></div>
            <div className="art-label label-top">KNOWLEDGE / 01</div><div className="art-label label-bottom">TEACH · BUILD · INSPIRE</div>
            <div className="art-index">01 <span>—</span> 06</div>
          </div>
          <div className="hero-bottom"><span>EDUCATION WITH PURPOSE</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></div>
        </section>

        <section className="intro-section section-pad" id="about">
          <div className="section-marker"><span>01</span> ABOUT</div>
          <div className="intro-grid"><h2>Technology is best learned <em>by doing.</em></h2><div><p className="large-copy">{content.profile.about}</p><div className="quote-rule"/><p className="muted-copy">A student-centred approach grounded in clarity, curiosity, practice and continuous learning.</p></div></div>
          <div className="stats-row"><div><strong>01</strong><span>Clear concepts</span></div><div><strong>02</strong><span>Practical learning</span></div><div><strong>03</strong><span>Student growth</span></div></div>
        </section>

        <section className="teaching-section section-pad" id="teaching">
          <div className="section-heading"><div><div className="section-marker"><span>02</span> TEACHING EXPERTISE</div><h2>Core areas of <em>learning.</em></h2></div><p>Foundational computing and emerging technologies, taught with structure and practical context.</p></div>
          <div className="expertise-grid">{skills.map((item, index) => { const Icon = iconMap[item.icon] || GraduationCap; return <article className="expertise-card" key={item.title}>{item.image && <img className="content-item-image" src={item.image} alt={item.title}/>}<div className="card-top"><span>0{index + 1}</span><Icon size={22}/></div><h3>{item.title}</h3><p>{item.description}</p><span className="card-arrow"><ArrowUpRight size={17}/></span></article>; })}</div>
        </section>

        <section className="courses-section section-pad" id="courses">
          <div className="section-marker"><span>03</span> COURSES & LEARNING</div><div className="section-heading"><h2>Learning, made <em>accessible.</em></h2><p>Structured learning material and courses for undergraduate Computer Science learners.</p></div>
          <div className="course-list">{(content.courses || []).map((course, i) => <article className="course-row" key={course.title}>{course.image && <img className="content-item-image course-image" src={course.image} alt={course.title}/>}<span className="course-num">0{i + 1}</span><div className="course-info"><h3>{course.title}</h3><p>{course.description}</p></div><span className="course-status">{course.status}</span>{course.link ? <a href={course.link} target="_blank" rel="noreferrer" aria-label={`Open ${course.title}`}><ExternalLink size={17}/></a> : <BookOpen size={18} className="course-icon"/>}</article>)}</div>
        </section>

        <section className="initiatives-section section-pad" id="initiatives">
          <div className="initiative-art"><div className="initiative-grid-lines"/><Sparkles size={30}/><span>LEARN<br/>FORWARD</span><small>KNOWLEDGE IS A PRACTICE</small></div>
          <div className="initiative-copy"><div className="section-marker"><span>04</span> BEYOND THE CLASSROOM</div><h2>Growing skills.<br/><em>Opening possibilities.</em></h2><p className="muted-copy">Education extends beyond a lecture. Mentoring, experimentation and exposure help learners connect ideas with their future.</p><div className="initiative-list">{(content.initiatives || []).map((item, i) => <div key={item.title}>{item.image && <img className="content-item-image initiative-item-image" src={item.image} alt={item.title}/>}<span>0{i + 1}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}</div></div>
        </section>

        <section className="career-section section-pad" id="career">
          <div className="section-marker"><span>05</span> ACADEMIC JOURNEY</div>
          <div className="career-columns">
            <div><h2>Qualifications & <em>experience.</em></h2><div className="timeline-list">{(content.qualifications || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}>{item.image && <img className="content-item-image timeline-image" src={item.image} alt={item.title}/>}<GraduationCap size={19}/><div><h3>{item.title}</h3><p>{item.institution || ''}{item.year ? ` · ${item.year}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{(content.experience || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}>{item.image && <img className="content-item-image timeline-image" src={item.image} alt={item.title}/>}<BriefcaseBusiness size={19}/><div><h3>{item.title}</h3><p>{item.organization || ''}{item.period ? ` · ${item.period}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{!(content.qualifications || []).length && !(content.experience || []).length && <p className="empty-section-note">Qualifications and experience can be added by the administrator.</p>}</div></div>
            <div><h2>Achievements & <em>recognition.</em></h2><div className="timeline-list">{(content.achievements || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}>{item.image && <img className="content-item-image timeline-image" src={item.image} alt={item.title}/>}<Award size={19}/><div><h3>{item.title}</h3><p>{item.organization || ''}{item.year ? ` · ${item.year}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{!(content.achievements || []).length && <p className="empty-section-note">Awards, certifications and achievements can be added here.</p>}</div></div>
          </div>
        </section>

        <section className="publications-section section-pad" id="publications">
          <div className="section-marker"><span>06</span> RESEARCH & PUBLICATIONS</div><h2>Ideas shared with the <em>academic community.</em></h2>
          <div className="publication-list">{(content.publications || []).map((item, i) => <article className="publication-row" key={`${item.title}-${i}`}>{item.image && <img className="content-item-image publication-image" src={item.image} alt={item.title}/>}<ScrollText size={20}/><div><h3>{item.title}</h3><p>{item.authors || ''}{item.year ? ` · ${item.year}` : ''}{item.publisher ? ` · ${item.publisher}` : ''}</p>{item.link && <a href={item.link} target="_blank" rel="noreferrer">View publication <ArrowUpRight size={15}/></a>}</div></article>)}{!(content.publications || []).length && <p className="empty-section-note">Publications, papers and conference presentations can be added here.</p>}</div>
        </section>

        <section className="resources-section section-pad" id="resources">
          <div className="section-marker"><span>05</span> LEARNING RESOURCES</div><div className="section-heading"><h2>Resources for the <em>next step.</em></h2><p>Notes, lessons and practice activities designed to support learning beyond class.</p></div>
          <div className="resource-grid">{(content.resources || []).map((item, i) => <article className="resource-card" key={item.title}>{item.image && <img className="content-item-image resource-image" src={item.image} alt={item.title}/>}<span className="resource-label">{item.label || 'LEARNING'}</span><div className="resource-icon">{i === 0 ? <BookOpen/> : i === 1 ? <BrainCircuit/> : <Code2/>}</div><h3>{item.title}</h3><p>{item.description}</p>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">Open resource <ArrowUpRight size={15}/></a> : <span className="coming-soon">RESOURCE LINK TO BE ADDED</span>}</article>)}</div>
        </section>

        {(content.customSections || []).filter(section => section.title).map((section, sectionIndex) => <section className="custom-public-section section-pad" id={section.id} key={section.id || sectionIndex}><div className="section-marker"><span>{String(7 + sectionIndex).padStart(2,'0')}</span> ADDITIONAL SECTION</div><div className="section-heading"><h2>{section.title}</h2>{section.description && <p>{section.description}</p>}</div>{section.image && <img className="content-item-image custom-section-image" src={section.image} alt={section.title}/>}<div className="custom-public-grid">{(section.items || []).map((item,itemIndex) => <article className="custom-public-card" key={itemIndex}>{item.image && <img className="content-item-image custom-item-image" src={item.image} alt={item.title || section.title}/>}<span>{String(itemIndex+1).padStart(2,'0')}</span><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}{item.link && <a href={item.link} target="_blank" rel="noreferrer">Learn more <ArrowUpRight size={15}/></a>}</article>)}</div></section>)}

        <section className="contact-section section-pad" id="contact"><div className="contact-overline">06 / CONTACT & COLLABORATION</div><h2>Let's make learning<br/><em>meaningful.</em></h2><p>For academic collaboration, learning resources or student-focused initiatives, feel free to connect.</p><div className="contact-details"><div><span>FACULTY</span><strong>{content.profile.name}</strong></div><div><span>INSTITUTION</span><strong>{content.profile.college}</strong></div><div><span>LOCATION</span><strong>{content.profile.location}</strong></div></div>{content.profile.email ? <a className="button button-light" href={`mailto:${content.profile.email}`}>Write an email <Mail size={16}/></a> : <span className="email-note">Contact details can be added by the portfolio administrator.</span>}<div className="social-links">{Object.entries(content.profile.socials || {}).filter(([, url]) => url).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name} <ArrowUpRight size={14}/></a>)}</div></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">R<span>.</span></span><span className="brand-text">{content.profile.name}<small>{content.profile.role}</small></span></a><p>{content.footer}</p><a href="#home" className="back-top">BACK TO TOP ↑</a><small className="copyright">© {new Date().getFullYear()} {content.profile.name}. Academic portfolio.</small></footer>


    </div>
  );
}

export default App;
