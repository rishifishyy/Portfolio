document.addEventListener("DOMContentLoaded", () => {
  if (typeof portfolioData === "undefined") {
    console.error("portfolioData is missing!");
    return;
  }

  renderProfile();
  renderSkills();
  renderExperience();
  renderProjects();
  renderEducation();
  renderLearningSkills();
  setupMobileNavigation();
  setupActiveNavObserver();
  setupModalHandlers();
  setupSmoothScroll();
  setupMusicPlayer();
  setupNameHoverAnimation();
  initAmbientParticles();
});

function renderProfile() {
  const { profile } = portfolioData;

  const navBrand = document.getElementById("nav-brand-name");
  const mobileBrand = document.getElementById("mobile-brand-name");
  const heroName = document.getElementById("hero-name");
  const heroTagline = document.getElementById("hero-tagline");
  const footerName = document.getElementById("footer-name");
  const heroAvatar = document.getElementById("hero-avatar");
  const statusBadge = document.getElementById("status-badge-text");
  const statusIndicator = document.getElementById("avatar-status-indicator");
  const aboutSummary = document.getElementById("about-summary-text");
  const currentYear = document.getElementById("current-year");

  if (navBrand) navBrand.textContent = profile.name;
  if (mobileBrand) mobileBrand.textContent = profile.name;
  if (heroName) heroName.textContent = profile.name;
  if (footerName) footerName.textContent = profile.name;
  if (heroTagline) heroTagline.textContent = profile.tagline;
  if (aboutSummary) aboutSummary.textContent = profile.summary;
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  if (heroAvatar && profile.avatarUrl) {
    heroAvatar.src = profile.avatarUrl;
    heroAvatar.alt = profile.name;
  }

  if (statusBadge && profile.statusBadge) {
    statusBadge.textContent = profile.statusBadge;
  }

  if (statusIndicator && !profile.statusAvailable) {
    statusIndicator.style.display = "none";
  }

  const ctaBtn = document.getElementById("cta-contact-btn");
  const linkEmail = document.getElementById("social-email");
  const linkLinkedin = document.getElementById("social-linkedin");
  const linkGithub = document.getElementById("social-github");
  const linkCodolio = document.getElementById("social-codolio");
  const footerEmail = document.getElementById("footer-email");
  const footerLinkedin = document.getElementById("footer-linkedin");
  const footerGithub = document.getElementById("footer-github");
  const footerCodolio = document.getElementById("footer-codolio");

  const mobileNavEmail = document.getElementById("mobile-nav-email-btn");
  const mobileDrawerEmail = document.getElementById("mobile-drawer-email");
  const mobileDrawerGithub = document.getElementById("mobile-drawer-github");
  const mobileDrawerLinkedin = document.getElementById("mobile-drawer-linkedin");
  const mobileDrawerCodolio = document.getElementById("mobile-drawer-codolio");

  const emailRaw = profile.contact && profile.contact.email ? profile.contact.email.replace(/^mailto:/, "") : "rishinehra1@gmail.com";
  const mailUrl = (profile.contact && profile.contact.mailUrl) 
    ? profile.contact.mailUrl 
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailRaw)}`;

  if (ctaBtn) {
    ctaBtn.href = mailUrl;
    ctaBtn.target = "_blank";
    ctaBtn.rel = "noopener noreferrer";
    ctaBtn.onclick = () => copyEmailToClipboard(emailRaw);
  }

  if (linkEmail) {
    linkEmail.href = mailUrl;
    linkEmail.target = "_blank";
    linkEmail.rel = "noopener noreferrer";
    linkEmail.onclick = () => copyEmailToClipboard(emailRaw);
  }

  if (footerEmail) {
    footerEmail.href = mailUrl;
    footerEmail.target = "_blank";
    footerEmail.rel = "noopener noreferrer";
    footerEmail.onclick = () => copyEmailToClipboard(emailRaw);
  }

  if (mobileNavEmail) {
    mobileNavEmail.href = mailUrl;
    mobileNavEmail.onclick = () => copyEmailToClipboard(emailRaw);
  }

  if (mobileDrawerEmail) {
    mobileDrawerEmail.href = mailUrl;
    mobileDrawerEmail.onclick = () => copyEmailToClipboard(emailRaw);
  }

  if (linkLinkedin && profile.contact.linkedin) linkLinkedin.href = profile.contact.linkedin;
  if (linkGithub && profile.contact.github) linkGithub.href = profile.contact.github;
  if (linkCodolio && profile.contact.codolio) linkCodolio.href = profile.contact.codolio;

  if (footerLinkedin && profile.contact.linkedin) footerLinkedin.href = profile.contact.linkedin;
  if (footerGithub && profile.contact.github) footerGithub.href = profile.contact.github;
  if (footerCodolio && profile.contact.codolio) footerCodolio.href = profile.contact.codolio;

  if (mobileDrawerLinkedin && profile.contact.linkedin) mobileDrawerLinkedin.href = profile.contact.linkedin;
  if (mobileDrawerGithub && profile.contact.github) mobileDrawerGithub.href = profile.contact.github;
  if (mobileDrawerCodolio && profile.contact.codolio) mobileDrawerCodolio.href = profile.contact.codolio;
}

function renderSkills() {
  const container = document.getElementById("skills-list");
  if (!container || !portfolioData.profile.skills) return;

  container.innerHTML = portfolioData.profile.skills
    .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
    .join("");
}

function renderExperience() {
  const container = document.getElementById("experience-list");
  if (!container || !portfolioData.experiences) return;

  container.innerHTML = portfolioData.experiences.map(exp => {
    const techPills = (exp.technologies || [])
      .map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`)
      .join("");

    const logoContent = exp.logoUrl 
      ? `<img src="${escapeHtml(exp.logoUrl)}" alt="${escapeHtml(exp.company)}" class="company-logo-img">`
      : escapeHtml(exp.logoText || exp.company.substring(0, 2).toUpperCase());

    return `
      <div class="experience-card" id="${escapeHtml(exp.id)}">
        <div class="experience-header-row">
          <div class="company-badge" style="background: ${exp.logoColor || 'var(--bg-muted)'};">
            ${logoContent}
          </div>
          
          <div class="experience-meta">
            <div class="experience-title-row">
              <div class="company-name">
                ${escapeHtml(exp.company)}
                <span class="role-name">(${escapeHtml(exp.role)})</span>
              </div>
              <div class="duration-chip">${escapeHtml(exp.duration)}</div>
            </div>
            
            <p class="experience-summary">${escapeHtml(exp.summary)}</p>
            
            <div class="tech-tags">
              ${techPills}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container || !portfolioData.projects) return;

  container.innerHTML = portfolioData.projects.map((project) => {
    const visibleTech = (project.techStack || []).slice(0, 4);
    const overflowCount = (project.techStack || []).length - visibleTech.length;

    const techTagsHtml = visibleTech
      .map(tech => `<span class="bento-tech-pill">${escapeHtml(tech)}</span>`)
      .join("") + (overflowCount > 0 ? `<span class="bento-tech-pill">+${overflowCount}</span>` : "");

    const isComingSoon = !!project.isComingSoon;
    const cardClass = isComingSoon ? 'bento-project-card coming-soon-card' : 'bento-project-card';
    const footerActionText = isComingSoon ? 'In Progress' : 'View project';

    const comingSoonOverlayHtml = isComingSoon ? `
      <div class="coming-soon-overlay" aria-hidden="true">
        <div class="coming-soon-badge-anim">
          <span class="coming-soon-pulse-dot"></span>
          <span class="coming-soon-text">COMING SOON</span>
        </div>
      </div>
    ` : '';

    return `
      <article 
        class="${cardClass}" 
        data-project-id="${escapeHtml(project.id)}"
        tabindex="0"
        role="button"
        aria-label="View project details for ${escapeHtml(project.title)}"
      >
        <div class="project-media-box">
          <img 
            src="${escapeHtml(project.image)}" 
            alt="${escapeHtml(project.title)}" 
            class="project-preview-img"
            loading="lazy"
          >
          <div class="project-type-badge">${escapeHtml(project.type)}</div>
          ${comingSoonOverlayHtml}
        </div>

        <div class="project-card-body">
          <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
          <p class="project-card-desc">${escapeHtml(project.shortDescription)}</p>

          <div class="project-tech-row">
            ${techTagsHtml}
          </div>

          <div class="project-card-footer">
            <span class="view-project-text">${footerActionText}</span>
            <div class="view-arrow-circle" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".bento-project-card").forEach(card => {
    const projectId = card.getAttribute("data-project-id");
    card.addEventListener("click", () => openProjectModal(projectId));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(projectId);
      }
    });
  });
}

function renderEducation() {
  const container = document.getElementById("education-list");
  if (!container || !portfolioData.education) return;

  container.innerHTML = portfolioData.education.map(edu => {
    return `
      <div class="education-card" id="${escapeHtml(edu.id)}">
        <div class="education-header-row">
          <div class="education-icon-box">
            <span class="education-icon">${edu.icon || '🎓'}</span>
          </div>
          
          <div class="education-meta">
            <div class="education-title-row">
              <div class="education-degree-group">
                <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
                <span class="education-institution">${escapeHtml(edu.institution)}</span>
              </div>
              <div class="education-score-chip">${escapeHtml(edu.score)}</div>
            </div>
            
            <div class="education-duration-row">
              <span class="education-duration">${escapeHtml(edu.duration)}</span>
            </div>
            
            <p class="education-desc">${escapeHtml(edu.description)}</p>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderLearningSkills() {
  const container = document.getElementById("learning-list");
  if (!container || !portfolioData.learningSkills) return;

  container.innerHTML = portfolioData.learningSkills.map(skill => {
    return `
      <div class="learning-card" id="${escapeHtml(skill.id)}">
        <div class="learning-header">
          <div class="learning-icon-box" style="background: ${skill.color || 'var(--bg-muted)'};">
            <span class="learning-icon">${skill.icon || '🚀'}</span>
          </div>
          <div class="learning-title-wrap">
            <div class="learning-title-row">
              <h3 class="learning-title">${escapeHtml(skill.name)}</h3>
            </div>
            <span class="learning-category">${escapeHtml(skill.category)}</span>
          </div>
        </div>
        <p class="learning-desc">${escapeHtml(skill.description)}</p>
      </div>
    `;
  }).join("");
}

function setupMobileNavigation() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const drawer = document.getElementById("mobile-nav-drawer");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const closeBtn = document.getElementById("mobile-nav-close");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

function setupActiveNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link[data-section]");
  const desktopLinks = document.querySelectorAll(".nav-link[href^='#']");

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        mobileLinks.forEach(link => {
          if (link.getAttribute("data-section") === id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });

        desktopLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.style.color = "var(--text-primary)";
          } else {
            link.style.color = "";
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

function setupModalHandlers() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", closeProjectModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = (portfolioData.projects || []).find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("project-modal");
  const titleEl = document.getElementById("modal-project-title");
  const typeEl = document.getElementById("modal-project-type");
  const imgEl = document.getElementById("modal-project-img");
  const overviewEl = document.getElementById("modal-project-overview");
  const problemEl = document.getElementById("modal-project-problem");
  const solutionEl = document.getElementById("modal-project-solution");
  const outcomesEl = document.getElementById("modal-project-outcomes");
  const techStackEl = document.getElementById("modal-project-techstack");
  const roleEl = document.getElementById("modal-project-role");
  const liveLink = document.getElementById("modal-live-link");
  const githubLink = document.getElementById("modal-github-link");

  if (titleEl) titleEl.textContent = project.title;
  if (typeEl) typeEl.textContent = project.type;
  if (imgEl) {
    imgEl.src = project.image;
    imgEl.alt = project.title;
  }
  if (overviewEl) overviewEl.textContent = project.fullDescription || project.shortDescription;
  if (problemEl) problemEl.textContent = project.problemStatement;
  if (solutionEl) solutionEl.textContent = project.solution;
  if (roleEl) roleEl.textContent = project.role;

  if (outcomesEl) {
    outcomesEl.innerHTML = (project.outcomes || [])
      .map(outcome => `<li>${escapeHtml(outcome)}</li>`)
      .join("");
  }

  if (techStackEl) {
    techStackEl.innerHTML = (project.techStack || [])
      .map(tech => `<span class="skill-tag">${escapeHtml(tech)}</span>`)
      .join("");
  }

  if (liveLink) {
    if (project.links && project.links.live) {
      liveLink.href = project.links.live;
      liveLink.style.display = "inline-flex";
    } else {
      liveLink.style.display = "none";
    }
  }

  if (githubLink) {
    if (project.links && project.links.github) {
      githubLink.href = project.links.github;
      githubLink.style.display = "inline-flex";
    } else {
      githubLink.style.display = "none";
    }
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

let bgAudio = null;
let isMusicPlaying = false;

function setupMusicPlayer() {
  const musicConfig = portfolioData.music || {
    idleText: "Play Music",
    trackTitle: "Just Chill and Code",
    artist: "Lofi Vibes",
    audioSrc: "assets/chill-beat.mp3"
  };

  const idleText = musicConfig.idleText || "Play Music";
  const playingText = musicConfig.trackTitle || "Just Chill and Code";

  const toggleBtn = document.getElementById("music-toggle-btn");
  const btnText = document.getElementById("music-btn-text");
  const playIcon = document.getElementById("nav-play-icon");
  const pauseIcon = document.getElementById("nav-pause-icon");

  if (btnText) btnText.textContent = idleText;

  try {
    bgAudio = new Audio(musicConfig.audioSrc);
    bgAudio.loop = true;
    bgAudio.volume = 0.75;

    bgAudio.addEventListener("play", () => setPlayingUI(true));
    bgAudio.addEventListener("pause", () => setPlayingUI(false));
    bgAudio.addEventListener("ended", () => setPlayingUI(false));
    bgAudio.addEventListener("error", (err) => {
      console.warn("Audio loading notice:", err);
    });
  } catch (e) {
    console.error("Audio init error:", e);
  }

  function toggleMusic() {
    if (!bgAudio) {
      bgAudio = new Audio(musicConfig.audioSrc);
      bgAudio.loop = true;
      bgAudio.volume = 0.75;
    }

    if (isMusicPlaying) {
      bgAudio.pause();
      setPlayingUI(false);
    } else {
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingUI(true);
          })
          .catch((error) => {
            console.warn("Audio playback prevented:", error);
            setPlayingUI(false);
          });
      }
    }
  }

  function setPlayingUI(playing) {
    isMusicPlaying = playing;

    if (toggleBtn) {
      if (playing) {
        toggleBtn.classList.add("playing");
      } else {
        toggleBtn.classList.remove("playing");
      }
    }

    if (btnText) {
      btnText.textContent = playing ? playingText : idleText;
    }

    if (playIcon && pauseIcon) {
      playIcon.style.display = playing ? "none" : "block";
      pauseIcon.style.display = playing ? "block" : "none";
    }
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleMusic);
}

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 8);
      const end = start + Math.floor(Math.random() * 8) + 6;
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function setupNameHoverAnimation() {
  const heroName = document.getElementById("hero-name");
  if (!heroName) return;

  const scrambler = new TextScramble(heroName);
  const originalName = "Rishi Nehra";
  const aliasName = "Rishifishyy";
  let isToggled = false;

  heroName.addEventListener("mouseenter", () => {
    scrambler.setText(aliasName);
  });

  heroName.addEventListener("mouseleave", () => {
    scrambler.setText(originalName);
  });

  // Tap-to-scramble support for mobile touch users
  heroName.addEventListener("click", () => {
    isToggled = !isToggled;
    scrambler.setText(isToggled ? aliasName : originalName);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initAmbientParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "ambient-particles";
  canvas.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.7;";
  
  const ambientBg = document.querySelector(".ambient-bg");
  if (ambientBg) {
    ambientBg.after(canvas);
  } else {
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  let w, h;

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 18 : 45;
  const particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = [
    "rgba(56, 189, 248, ",
    "rgba(129, 140, 248, ",
    "rgba(168, 85, 247, ",
    "rgba(45, 212, 191, ",
    "rgba(255, 255, 255, ",
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      alphaDir: (Math.random() - 0.5) * 0.005,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      p.alpha += p.alphaDir;
      if (p.alpha > 0.8 || p.alpha < 0.1) p.alphaDir *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha.toFixed(2) + ")";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function copyEmailToClipboard(email) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => showToast(`Copied ${email} to clipboard!`))
      .catch(() => showToast(`Opening compose for ${email}...`));
  } else {
    showToast(`Opening compose for ${email}...`);
  }
}

function showToast(message) {
  let toast = document.getElementById("portfolio-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "portfolio-toast";
    toast.className = "portfolio-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="toast-content">
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
