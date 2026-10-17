
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
              <div className="notice">Edit the website content below. Preserve the JSON structure and valid syntax, then publish to update the public site.</div>
              <label className="json-label">Website content<textarea className="json-editor" spellCheck="false" value={editJson} onChange={e => setEditJson(e.target.value)} /></label>
              <div className="admin-tools">
                <div className="upload-actions"><label className="upload-button"><ImagePlus size={16}/>Upload profile photo<input type="file" accept="image/*" onChange={e => uploadImage(e, 'photo')} hidden disabled={uploadBusy}/></label><label className="upload-button"><ImagePlus size={16}/>Upload college logo<input type="file" accept="image/*" onChange={e => uploadImage(e, 'collegeLogo')} hidden disabled={uploadBusy}/></label><label className="upload-button"><FileText size={16}/>{uploadBusy ? 'Uploading…' : 'Upload lecture PDF'}<input type="file" accept="application/pdf,.pdf" onChange={uploadResource} hidden disabled={uploadBusy}/></label></div>
                <button className="button button-dark" onClick={saveContent}><Save size={16}/> Publish changes</button>
              </div>
              {editError && <p className="form-error">{editError}</p>}
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
          <div className="expertise-grid">{skills.map((item, index) => { const Icon = iconMap[item.icon] || GraduationCap; return <article className="expertise-card" key={item.title}><div className="card-top"><span>0{index + 1}</span><Icon size={22}/></div><h3>{item.title}</h3><p>{item.description}</p><span className="card-arrow"><ArrowUpRight size={17}/></span></article>; })}</div>
        </section>

        <section className="courses-section section-pad" id="courses">
          <div className="section-marker"><span>03</span> COURSES & LEARNING</div><div className="section-heading"><h2>Learning, made <em>accessible.</em></h2><p>Structured learning material and courses for undergraduate Computer Science learners.</p></div>
          <div className="course-list">{(content.courses || []).map((course, i) => <article className="course-row" key={course.title}><span className="course-num">0{i + 1}</span><div className="course-info"><h3>{course.title}</h3><p>{course.description}</p></div><span className="course-status">{course.status}</span>{course.link ? <a href={course.link} target="_blank" rel="noreferrer" aria-label={`Open ${course.title}`}><ExternalLink size={17}/></a> : <BookOpen size={18} className="course-icon"/>}</article>)}</div>
        </section>

        <section className="initiatives-section section-pad" id="initiatives">
          <div className="initiative-art"><div className="initiative-grid-lines"/><Sparkles size={30}/><span>LEARN<br/>FORWARD</span><small>KNOWLEDGE IS A PRACTICE</small></div>
          <div className="initiative-copy"><div className="section-marker"><span>04</span> BEYOND THE CLASSROOM</div><h2>Growing skills.<br/><em>Opening possibilities.</em></h2><p className="muted-copy">Education extends beyond a lecture. Mentoring, experimentation and exposure help learners connect ideas with their future.</p><div className="initiative-list">{(content.initiatives || []).map((item, i) => <div key={item.title}><span>0{i + 1}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}</div></div>
        </section>

        <section className="career-section section-pad" id="career">
          <div className="section-marker"><span>05</span> ACADEMIC JOURNEY</div>
          <div className="career-columns">
            <div><h2>Qualifications & <em>experience.</em></h2><div className="timeline-list">{(content.qualifications || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}><GraduationCap size={19}/><div><h3>{item.title}</h3><p>{item.institution || ''}{item.year ? ` · ${item.year}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{(content.experience || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}><BriefcaseBusiness size={19}/><div><h3>{item.title}</h3><p>{item.organization || ''}{item.period ? ` · ${item.period}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{!(content.qualifications || []).length && !(content.experience || []).length && <p className="empty-section-note">Qualifications and experience can be added by the administrator.</p>}</div></div>
            <div><h2>Achievements & <em>recognition.</em></h2><div className="timeline-list">{(content.achievements || []).map((item, i) => <article className="timeline-item" key={`${item.title}-${i}`}><Award size={19}/><div><h3>{item.title}</h3><p>{item.organization || ''}{item.year ? ` · ${item.year}` : ''}</p>{item.description && <small>{item.description}</small>}</div></article>)}{!(content.achievements || []).length && <p className="empty-section-note">Awards, certifications and achievements can be added here.</p>}</div></div>
          </div>
        </section>

        <section className="publications-section section-pad" id="publications">
          <div className="section-marker"><span>06</span> RESEARCH & PUBLICATIONS</div><h2>Ideas shared with the <em>academic community.</em></h2>
          <div className="publication-list">{(content.publications || []).map((item, i) => <article className="publication-row" key={`${item.title}-${i}`}><ScrollText size={20}/><div><h3>{item.title}</h3><p>{item.authors || ''}{item.year ? ` · ${item.year}` : ''}{item.publisher ? ` · ${item.publisher}` : ''}</p>{item.link && <a href={item.link} target="_blank" rel="noreferrer">View publication <ArrowUpRight size={15}/></a>}</div></article>)}{!(content.publications || []).length && <p className="empty-section-note">Publications, papers and conference presentations can be added here.</p>}</div>
        </section>

        <section className="resources-section section-pad" id="resources">
          <div className="section-marker"><span>05</span> LEARNING RESOURCES</div><div className="section-heading"><h2>Resources for the <em>next step.</em></h2><p>Notes, lessons and practice activities designed to support learning beyond class.</p></div>
          <div className="resource-grid">{(content.resources || []).map((item, i) => <article className="resource-card" key={item.title}><span className="resource-label">{item.label || 'LEARNING'}</span><div className="resource-icon">{i === 0 ? <BookOpen/> : i === 1 ? <BrainCircuit/> : <Code2/>}</div><h3>{item.title}</h3><p>{item.description}</p>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">Open resource <ArrowUpRight size={15}/></a> : <span className="coming-soon">RESOURCE LINK TO BE ADDED</span>}</article>)}</div>
        </section>

        <section className="contact-section section-pad" id="contact"><div className="contact-overline">06 / CONTACT & COLLABORATION</div><h2>Let's make learning<br/><em>meaningful.</em></h2><p>For academic collaboration, learning resources or student-focused initiatives, feel free to connect.</p><div className="contact-details"><div><span>FACULTY</span><strong>{content.profile.name}</strong></div><div><span>INSTITUTION</span><strong>{content.profile.college}</strong></div><div><span>LOCATION</span><strong>{content.profile.location}</strong></div></div>{content.profile.email ? <a className="button button-light" href={`mailto:${content.profile.email}`}>Write an email <Mail size={16}/></a> : <span className="email-note">Contact details can be added by the portfolio administrator.</span>}<div className="social-links">{Object.entries(content.profile.socials || {}).filter(([, url]) => url).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name} <ArrowUpRight size={14}/></a>)}</div></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">R<span>.</span></span><span className="brand-text">{content.profile.name}<small>{content.profile.role}</small></span></a><p>{content.footer}</p><a href="#home" className="back-top">BACK TO TOP ↑</a><small className="copyright">© {new Date().getFullYear()} {content.profile.name}. Academic portfolio.</small></footer>


    </div>
  );
}

export default App;
