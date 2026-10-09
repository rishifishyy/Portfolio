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
  setupSnakeGame();
  setupNameHoverAnimation();
  initCodingActivity();
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
        <div class="project-media-box${project.previewAspect ? ' project-media-wide' : ''}">
          <img 
            src="${escapeHtml(project.image)}" 
            ${project.imageSrcset ? `srcset="${escapeHtml(project.imageSrcset)}" sizes="(min-width: 1024px) 540px, (min-width: 768px) 46vw, 100vw"` : ''}
            alt="${escapeHtml(project.imageAlt || project.title)}"
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
  window.PORTFOLIO_LEARNING_SKILLS = portfolioData.learningSkills;
  const load = () => {
    const script = document.createElement('script');
    script.src = 'learning.bundle.js?v=1.0';
    script.async = true;
    document.body.appendChild(script);
  };
  if (!("IntersectionObserver" in window)) return load();
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    load();
  }, { rootMargin: '600px' });
  observer.observe(container);
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
  const outcomesEl = document.getElementById("modal-project-outcomes");
  const techStackEl = document.getElementById("modal-project-techstack");
  const liveLink = document.getElementById("modal-live-link");
  const githubLink = document.getElementById("modal-github-link");

  if (titleEl) titleEl.textContent = project.title;
  if (typeEl) typeEl.textContent = project.type;
  if (imgEl) {
    imgEl.src = project.image;
    if (project.imageSrcset) {
      imgEl.srcset = project.imageSrcset;
      imgEl.sizes = '(min-width: 960px) 840px, 90vw';
    } else {
      imgEl.removeAttribute('srcset');
      imgEl.removeAttribute('sizes');
    }
    imgEl.alt = project.imageAlt || project.title;
    imgEl.closest('.modal-hero-media').classList.toggle('project-media-wide', !!project.previewAspect);
  }
  if (overviewEl) overviewEl.textContent = project.fullDescription || project.shortDescription;

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
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
      }
    });
  });
}

function setupSnakeGame() {
  const modal = document.getElementById("snake-modal");
  const openButton = document.getElementById("game-toggle-btn");
  const closeButton = document.getElementById("snake-close-btn");
  const backdrop = document.getElementById("snake-modal-backdrop");
  const canvas = document.getElementById("snake-canvas");
  const screen = document.getElementById("snake-screen");
  const message = document.getElementById("snake-message");
  const startButton = document.getElementById("snake-start-btn");
  const scoreElement = document.getElementById("snake-score");
  const bestElement = document.getElementById("snake-best-score");
  if (!modal || !canvas) return;

  const context = canvas.getContext("2d", { alpha: false });
  const gridSize = 20;

  // Game state & loop
  let running = false;
  let frameId = null;
  let lastTime = 0;
  let score = 0;
  let bestScore = 0;
  let startingBestScore = 0;

  // Continuous physics & path trail
  const headRadius = 10;
  const bodyRadius = 9;
  const spacing = 11; // Arc-length distance between consecutive body segments
  const minTurnDist = 18; // Minimum travel distance between turns to prevent accidental self-overlap

  let head = { x: 192, y: 240 };
  let direction = { x: 1, y: 0 };
  let inputQueue = [];
  let distanceSinceTurn = 100;
  let trail = []; // Records continuous head position history
  let numSegments = 10; // Active length of snake
  let food = { x: 336, y: 240 };
  let particles = [];

  const syncStatus = document.getElementById("snake-sync-status");
  let scoreStorage;
  try { scoreStorage = window.localStorage; } catch {}
  function renderScoreState(state) {
    bestScore = state.bestScore ?? 0;
    const displayScore = String(state.bestScore ?? "—");
    if (bestElement.textContent !== displayScore) bestElement.textContent = displayScore;
    if (syncStatus) {
      // Keep sync messages out of active play without collapsing their layout space.
      const status = running ? "" : state.status;
      if (syncStatus.textContent !== status) syncStatus.textContent = status;
      syncStatus.dataset.state = state.state;
    }
  }
  const local = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) || window.location.hostname.endsWith(".netlify.app");
  const scoreClient = window.createSnakeScoreClient({
    endpoint: local ? "/api/snake-best" : window.PORTFOLIO_SNAKE_API,
    storage: scoreStorage,
    onChange: renderScoreState
  });
  const loadBestScore = () => scoreClient.refresh();
  const submitBestScore = value => scoreClient.submit(value);
  void loadBestScore();

  // Distance from point (px, py) to line segment (x1, y1)-(x2, y2)
  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // Sample segment coordinates along the head's exact path trail
  function getSegmentPositions() {
    const points = [{ x: head.x, y: head.y }];
    if (numSegments <= 1 || trail.length < 2) return points;

    let currentDist = 0;
    let trailIdx = 0;

    for (let s = 1; s < numSegments; s++) {
      const targetDist = s * spacing;

      while (trailIdx < trail.length - 1) {
        const p1 = trail[trailIdx];
        const p2 = trail[trailIdx + 1];
        const segDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (segDist === 0) {
          trailIdx++;
          continue;
        }

        if (currentDist + segDist >= targetDist) {
          const factor = (targetDist - currentDist) / segDist;
          points.push({
            x: p1.x + (p2.x - p1.x) * factor,
            y: p1.y + (p2.y - p1.y) * factor
          });
          break;
        } else {
          currentDist += segDist;
          trailIdx++;
        }
      }
      if (points.length <= s) {
        points.push({ ...trail[trail.length - 1] });
      }
    }
    return points;
  }

  function resetGame() {
    startingBestScore = bestScore;
    head = { x: 192, y: 240 };
    direction = { x: 1, y: 0 };
    inputQueue = [];
    distanceSinceTurn = 100;
    numSegments = 10;
    score = 0;
    scoreElement.textContent = "0";
    lastTime = 0;
    particles = [];

    // Pre-populate initial straight trail behind head
    trail = [];
    const initialTrailLength = (numSegments + 3) * spacing;
    for (let d = 0; d <= initialTrailLength; d += 2) {
      trail.push({ x: head.x - d, y: head.y });
    }

    placeFood();
    const segments = getSegmentPositions();
    draw(segments);
  }

  function placeFood() {
    const cellSize = canvas.width / gridSize;
    let attempts = 0;
    let valid = false;
    let candidate = { x: 336, y: 240 };
    const currentSegments = getSegmentPositions();

    while (!valid && attempts < 500) {
      const col = Math.floor(Math.random() * 18) + 1;
      const row = Math.floor(Math.random() * 18) + 1;
      candidate = {
        x: (col + 0.5) * cellSize,
        y: (row + 0.5) * cellSize
      };
      const tooClose = currentSegments.some(seg => Math.hypot(candidate.x - seg.x, candidate.y - seg.y) < 24);
      if (!tooClose) {
        valid = true;
      }
      attempts++;
    }
    food = candidate;
  }

  function queueDirection(name) {
    const choices = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    const newDir = choices[name];
    if (!newDir) return;

    // Disallow 180° turnaround into own body
    const refDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : direction;
    if (newDir.x === -refDir.x && newDir.y === -refDir.y) return;
    if (newDir.x === refDir.x && newDir.y === refDir.y) return;

    // Hyper-responsive: if travel threshold since last turn is met, turn INSTANTLY!
    if (distanceSinceTurn >= minTurnDist && inputQueue.length === 0) {
      direction = newDir;
      distanceSinceTurn = 0;
      trail.unshift({ x: head.x, y: head.y });
    } else if (inputQueue.length < 2) {
      // Buffer fast consecutive turns (e.g. quick cornering)
      inputQueue.push(newDir);
    }
  }

  function updateGame(dt) {
    // Process buffered turn if travel threshold reached
    if (inputQueue.length > 0 && distanceSinceTurn >= minTurnDist) {
      const nextDir = inputQueue.shift();
      if (!(nextDir.x === -direction.x && nextDir.y === -direction.y)) {
        direction = nextDir;
        distanceSinceTurn = 0;
        trail.unshift({ x: head.x, y: head.y });
      }
    }

    // Smooth speed scaling: starts fluid (170px/s), ramps gently up to 270px/s with score
    const speed = Math.min(270, 170 + score * 3.4);
    const moveDist = speed * dt;
    distanceSinceTurn += moveDist;

    // Advance head continuously
    head.x += direction.x * moveDist;
    head.y += direction.y * moveDist;
    trail.unshift({ x: head.x, y: head.y });

    // Trim trail to keep memory lightweight
    const maxTrailDist = numSegments * spacing + 40;
    let accDist = 0;
    let keepCount = trail.length;
    for (let i = 0; i < trail.length - 1; i++) {
      const d = Math.hypot(trail[i + 1].x - trail[i].x, trail[i + 1].y - trail[i].y);
      accDist += d;
      if (accDist > maxTrailDist) {
        keepCount = i + 2;
        break;
      }
    }
    if (trail.length > keepCount) {
      trail.length = keepCount;
    }

    // Calculate segment positions along trail
    const segments = getSegmentPositions();

    // 1. Strict Wall Collision Check
    if (head.x < headRadius || head.x > canvas.width - headRadius ||
        head.y < headRadius || head.y > canvas.height - headRadius) {
      return gameOver(segments);
    }

    // 2. Strict Self Collision Check:
    // Segments 0..3 are the neck directly behind head (< 44px path distance).
    // Any segment from index 4 onwards constitutes body that CANNOT be entered.
    let hitSelf = false;
    for (let k = 4; k < segments.length - 1; k++) {
      const d = distToSegment(head.x, head.y, segments[k].x, segments[k].y, segments[k + 1].x, segments[k + 1].y);
      if (d < 15.2) {
        hitSelf = true;
        break;
      }
    }
    if (!hitSelf && segments.length >= 5) {
      const tailSeg = segments[segments.length - 1];
      if (Math.hypot(head.x - tailSeg.x, head.y - tailSeg.y) < 15.2) {
        hitSelf = true;
      }
    }

    if (hitSelf) {
      return gameOver(segments);
    }

    // 3. Eating Food
    const foodRadius = 9;
    if (Math.hypot(head.x - food.x, head.y - food.y) < headRadius + foodRadius + 1) {
      score += 1;
      scoreElement.textContent = score;
      if (score > bestScore) void submitBestScore(score);
      numSegments += 3;

      // Sparkle burst
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + (Math.random() * 0.4 - 0.2);
        const spd = 45 + Math.random() * 65;
        particles.push({
          x: food.x,
          y: food.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0.35,
          maxLife: 0.35,
          color: i % 2 === 0 ? "#ef4444" : "#d7f886"
        });
      }

      placeFood();
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    return segments;
  }

  function draw(segments) {
    if (!segments) segments = getSegmentPositions();
    const cellSize = canvas.width / gridSize;

    // Clear board background
    const lightTheme = document.documentElement.dataset.theme === "light";
    context.fillStyle = lightTheme ? "#e7efd9" : "#07110a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    context.strokeStyle = lightTheme ? "rgba(56, 83, 28, 0.1)" : "rgba(135, 181, 89, 0.08)";
    context.lineWidth = 1;
    for (let index = 0; index <= gridSize; index++) {
      const p = index * cellSize;
      context.beginPath(); context.moveTo(p, 0); context.lineTo(p, canvas.height); context.stroke();
      context.beginPath(); context.moveTo(0, p); context.lineTo(canvas.width, p); context.stroke();
    }

    // Draw Particles
    particles.forEach(p => {
      const alpha = Math.max(0, p.life / p.maxLife);
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = p.color;
      context.shadowColor = p.color;
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(p.x, p.y, 3 * alpha, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });

    // Draw Food (Glowing pulsing apple)
    const time = performance.now();
    const pulse = Math.sin(time * 0.007) * 1.5;
    const fx = food.x;
    const fy = food.y;
    const foodRadius = Math.max(2, 9 + pulse);

    context.save();
    context.shadowColor = "rgba(239, 68, 68, 0.7)";
    context.shadowBlur = 12;
    context.fillStyle = "#ef4444";
    context.beginPath();
    context.arc(fx, fy, foodRadius, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;
    context.fillStyle = "#fca5a5";
    context.beginPath();
    context.arc(fx - foodRadius * 0.3, fy - foodRadius * 0.3, foodRadius * 0.28, 0, Math.PI * 2);
    context.fill();

    // Leaf stem
    context.fillStyle = "#84cc16";
    context.beginPath();
    context.ellipse(fx + 2, fy - foodRadius - 1, 3.5, 2, Math.PI / 4, 0, Math.PI * 2);
    context.fill();
    context.restore();

    // Draw Connected Snake Body
    if (segments.length > 1) {
      context.save();
      context.shadowColor = "rgba(143, 190, 77, 0.25)";
      context.shadowBlur = 8;
      context.lineCap = "round";
      context.lineJoin = "round";

      // Render connected smooth segments from tail to head
      for (let i = segments.length - 1; i > 0; i--) {
        const p1 = segments[i];
        const p2 = segments[i - 1];
        const ratio = 1 - (i / Math.max(segments.length, 1)) * 0.42;

        context.beginPath();
        context.strokeStyle = lightTheme ? `rgba(55, 105, 32, ${Math.max(0.8, ratio)})` : `rgba(130, 185, 60, ${Math.max(0.68, ratio)})`;
        context.lineWidth = bodyRadius * 2;
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.stroke();
      }
      context.restore();

      // Inner spine highlight for sleek 3D depth
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 4;
      context.strokeStyle = "rgba(215, 248, 134, 0.45)";
      context.beginPath();
      context.moveTo(segments[0].x, segments[0].y);
      for (let i = 1; i < segments.length; i++) {
        context.lineTo(segments[i].x, segments[i].y);
      }
      context.stroke();
      context.restore();
    }

    // Draw Snake Head
    if (segments.length > 0) {
      const h = segments[0];
      context.save();
      context.fillStyle = lightTheme ? "#457b2a" : "#d7f886";
      context.shadowColor = "rgba(215, 248, 134, 0.65)";
      context.shadowBlur = 12;
      context.beginPath();
      context.arc(h.x, h.y, headRadius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      // Eyes pointing in current heading
      const eyeDist = 4.8;
      const eyeForward = 3.6;
      const eyeRadius = 2.4;
      const pupilRadius = 1.2;
      let e1 = { x: 0, y: 0 }, e2 = { x: 0, y: 0 };

      if (direction.x === 1) { // Right
        e1 = { x: h.x + eyeForward, y: h.y - eyeDist };
        e2 = { x: h.x + eyeForward, y: h.y + eyeDist };
      } else if (direction.x === -1) { // Left
        e1 = { x: h.x - eyeForward, y: h.y - eyeDist };
        e2 = { x: h.x - eyeForward, y: h.y + eyeDist };
      } else if (direction.y === 1) { // Down
        e1 = { x: h.x - eyeDist, y: h.y + eyeForward };
        e2 = { x: h.x + eyeDist, y: h.y + eyeForward };
      } else { // Up
        e1 = { x: h.x - eyeDist, y: h.y - eyeForward };
        e2 = { x: h.x + eyeDist, y: h.y - eyeForward };
      }

      // Eye whites
      context.fillStyle = "#112006";
      context.beginPath();
      context.arc(e1.x, e1.y, eyeRadius, 0, Math.PI * 2);
      context.arc(e2.x, e2.y, eyeRadius, 0, Math.PI * 2);
      context.fill();

      // Eye pupils
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(e1.x + direction.x * 0.8, e1.y + direction.y * 0.8, pupilRadius, 0, Math.PI * 2);
      context.arc(e2.x + direction.x * 0.8, e2.y + direction.y * 0.8, pupilRadius, 0, Math.PI * 2);
      context.fill();

      context.restore();
    }
  }

  function animate(now) {
    if (!running) return;
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;

    const segments = updateGame(dt);
    if (running) {
      draw(segments);
      frameId = requestAnimationFrame(animate);
    }
  }

  function startGame() {
    cancelAnimationFrame(frameId);
    resetGame();
    running = true;
    renderScoreState(scoreClient.getState());
    screen.hidden = true;
    lastTime = 0;
    frameId = requestAnimationFrame(animate);
  }

  function gameOver(segments) {
    cancelAnimationFrame(frameId);
    running = false;
    draw(segments);
    const recordState = scoreClient.getState();
    renderScoreState(recordState);
    if (score > startingBestScore && recordState.connected && recordState.bestScore === score) {
      message.textContent = `New global record: ${score}!`;
    } else {
      message.textContent = `Game over — score ${score}`;
    }
    startButton.textContent = "Play again";
    screen.hidden = false;
  }

  function pauseGame() {
    if (!running) return;
    cancelAnimationFrame(frameId);
    running = false;
    renderScoreState(scoreClient.getState());
    message.textContent = "Game paused — press Start to play again";
    startButton.textContent = "Start game";
    screen.hidden = false;
  }

  function openGame() {
    openButton.classList.add("activated");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("snake-open");
    scoreClient.setActive(!document.hidden);
    if (!running) resetGame();
    closeButton.focus();
  }

  function closeGame() {
    pauseGame();
    scoreClient.setActive(false);
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("snake-open");
    openButton.focus();
  }

  openButton.addEventListener("click", openGame);
  closeButton.addEventListener("click", closeGame);
  backdrop.addEventListener("click", closeGame);
  startButton.addEventListener("click", () => running ? null : startGame());

  // On-screen direction controls (Mobile & Tablet)
  let lastTouchInputTime = 0;
  document.querySelectorAll("[data-direction]").forEach(button => {
    const handleControlInput = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const now = Date.now();
      if (now - lastTouchInputTime < 30) return;
      lastTouchInputTime = now;

      if (!running && screen.hidden === false) {
        startGame();
      }
      queueDirection(button.dataset.direction);
    };
    button.addEventListener("touchstart", handleControlInput, { passive: false });
    button.addEventListener("pointerdown", handleControlInput, { passive: false });
  });

  // Keyboard controls (Desktop)
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) return;
    const keys = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right"
    };
    if (keys[event.key]) {
      event.preventDefault();
      if (!running && screen.hidden === false) {
        startGame();
      }
      queueDirection(keys[event.key]);
    }
    if (event.key === "Escape") closeGame();
    if (event.key === " ") {
      event.preventDefault();
      if (!running) startGame();
    }
  });

  // Mobile Touch Swipe & Continuous Drag Steering
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }
  }, { passive: true });

  canvas.addEventListener("touchmove", (e) => {
    if (!modal.classList.contains("open")) return;
    e.preventDefault(); // Prevents page scroll while playing

    if (isSwiping && e.touches.length === 1) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartX;
      const dy = currentY - touchStartY;
      const dist = Math.hypot(dx, dy);

      // Fast, responsive 12px threshold for turn activation
      if (dist >= 12) {
        if (!running && screen.hidden === false) {
          startGame();
        }
        if (Math.abs(dx) > Math.abs(dy)) {
          queueDirection(dx > 0 ? "right" : "left");
        } else {
          queueDirection(dy > 0 ? "down" : "up");
        }
        // Continuous steering: update anchor so user doesn't need to lift finger
        touchStartX = currentX;
        touchStartY = currentY;
      }
    }
  }, { passive: false });

  canvas.addEventListener("touchend", () => {
    isSwiping = false;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseGame();
    scoreClient.setActive(!document.hidden && modal.classList.contains("open"));
  });
  window.addEventListener("online", () => { void loadBestScore(); });
  window.addEventListener("pagehide", () => scoreClient.setActive(false));
  window.addEventListener("pageshow", () => scoreClient.setActive(!document.hidden && modal.classList.contains("open")));
  document.addEventListener("portfolio-theme-change", () => { if (modal.classList.contains("open")) draw(); });
}

function setupNameHoverAnimation() {
  const originalName = portfolioData.profile.name;
  const aliasName = 'Rishifishyy';
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function makeLetters(element) {
    const row = (name, kind) => '<span class="name-' + kind + '-row">' +
      Array.from(name, (char, index) => '<span class="name-letter"><span class="name-' + kind + '" style="--letter-delay: ' + (index * 100) + 'ms">' + escapeHtml(char) + '</span></span>').join('') + '</span>';
    element.innerHTML = '<span class="name-switch-track" aria-hidden="true">' + row(originalName, 'original') + row(aliasName, 'alias') + '</span>';
  }

  // A quick pass of the pointer still completes the reveal before returning.
  function hoverReveal(target, show) {
    let started = 0, resetTimer = 0;
    const enter = () => {
      clearTimeout(resetTimer);
      started = performance.now();
      show(true);
    };
    const leave = () => {
      clearTimeout(resetTimer);
      const hold = document.documentElement.dataset.motion === 'off' ? 0 : 3100;
      resetTimer = setTimeout(() => show(false), Math.max(0, hold - (performance.now() - started)));
    };
    target.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') enter(); });
    target.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') leave(); });
    return () => clearTimeout(resetTimer);
  }

  const heroName = document.getElementById('hero-name');
  if (heroName) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'name-switch';
    button.id = 'hero-name-trigger';
    button.title = 'Hover or tap to reveal my nickname';
    makeLetters(button);
    heroName.replaceChildren(button);
    let alias = false;
    const show = value => {
      alias = value;
      button.classList.toggle('is-alias', value);
      button.dataset.name = value ? aliasName : originalName;
      button.setAttribute('aria-label', value ? aliasName + ' — show Rishi Nehra' : originalName + ' — show Rishifishyy');
      button.setAttribute('aria-pressed', String(value));
    };
    show(false);
    const cancelReset = hoverReveal(button, show);
    button.addEventListener('click', event => {
      if (event.detail === 0 || !finePointer.matches) { cancelReset(); show(!alias); }
    });
    button.addEventListener('blur', () => { cancelReset(); show(false); });
  }

  const brand = document.getElementById('brand-logo');
  const brandName = document.getElementById('nav-brand-name');
  if (brand && brandName) {
    makeLetters(brandName);
    brandName.classList.add('name-switch', 'name-switch-brand');
    brand.setAttribute('aria-label', 'Rishi Nehra — home');
    const cancelReset = hoverReveal(brand, value => brandName.classList.toggle('is-alias', value));
    brand.addEventListener('focus', () => brandName.classList.add('is-alias'));
    brand.addEventListener('blur', () => { cancelReset(); brandName.classList.remove('is-alias'); });
  }
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

/* ==========================================================================
   DSA Contribution Graph (LeetCode Style)
   ========================================================================== */

function initCodingActivity() {
  const container = document.getElementById("activity-calendar");
  const scrollArea = document.getElementById("activity-scroll-area");

  if (!container) return;

  // Create floating tooltip
  let tooltip = document.getElementById("activity-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "activity-tooltip";
    tooltip.className = "activity-tooltip";
    document.body.appendChild(tooltip);
  }

  // Fetch combined activity data
  async function loadData() {
    const local = ["localhost", "127.0.0.1"].includes(window.location?.hostname) || window.location?.hostname?.endsWith(".netlify.app");
    const apiUrl = !local && window.PORTFOLIO_ACTIVITY_API
      ? window.PORTFOLIO_ACTIVITY_API : "/api/coding-activity?refresh=true";
    try {
      const res = await fetch(apiUrl, {
        cache: "no-store",
        signal: typeof AbortSignal !== "undefined" ? AbortSignal.timeout(30000) : undefined
      });
      if (res.ok) {
        const data = await res.json();
        if (data.days && typeof data.days === "object" && !Array.isArray(data.days)) return data;
      }
    } catch (e) {
      console.warn("Live coding activity unavailable, trying saved activity:", e.message);
    }

    try {
      const fallbackRes = await fetch("data/coding-activity.json?t=" + Date.now(), { cache: "no-store" });
      if (fallbackRes.ok) return await fallbackRes.json();
    } catch (err) {
      console.error("Failed to load activity fallback data:", err);
    }
    return null;
  }

  let loading = false;
  async function refreshCalendar() {
    if (loading) return;
    loading = true;
    try {
      const data = await loadData();
      if (!data) {
        if (!container.querySelector(".activity-cell")) {
          container.innerHTML = `<div class="activity-calendar-loading"><span>Unable to load contribution graph.</span></div>`;
        }
        return;
      }
      renderCalendar(data);
    } finally { loading = false; }
  }
  refreshCalendar();
  setupSectionObserver();
  setInterval(() => { if (!document.hidden) refreshCalendar(); }, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshCalendar(); });
  document.addEventListener("touchstart", e => {
    if (!e.target.closest(".activity-cell")) hideTooltip();
  }, { passive: true });
  window.addEventListener('scroll', hideTooltip, { passive: true, capture: true });
  window.addEventListener('resize', hideTooltip, { passive: true });

  function renderCalendar(data) {
    const now = new Date();
    const { days: daysData } = ActivityCalendar.summarize(data.days || {}, now);
    const window = ActivityCalendar.range(now);
    const activeToday = window.end;
    const activeTodayStr = window.endDate;
    const formatDate = ActivityCalendar.dateKey;
    const startDate = new Date(window.start);
    startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());
    const totalWeeks = Math.ceil(((activeToday - startDate) / ActivityCalendar.DAY_MS + 1) / 7);

    const status = document.getElementById("activity-status");
    if (status) {
      const updated = data.updatedAt ? new Date(data.updatedAt) : null;
      const outdated = !updated || Number.isNaN(updated.getTime()) || now - updated > 15 * 60 * 1000;
      const label = updated && !Number.isNaN(updated.getTime())
        ? updated.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST"
        : "unknown";
      status.textContent = `${data.stale || outdated ? "Saved activity" : "Updated"}: ${label} · Past 365 days`;
      status.title = Object.entries(data.sources || {}).map(([platform, source]) => {
        const time = source.updatedAt ? new Date(source.updatedAt) : null;
        const label = time && !Number.isNaN(time.getTime())
          ? time.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST" : "unknown";
        return `${platform === "leetcode" ? "LeetCode" : "GFG"}: ${source.status === "live" ? "fetched" : "saved"} ${label}`;
      }).join("\n") + "\nActivity is checked on visits and every five minutes while this page is open. Saved activity is shown when fresh data is unavailable.";
    }

    const weeks = [];
    let curr = new Date(startDate);

    for (let w = 0; w < totalWeeks; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(curr);
        const dateStr = formatDate(dateObj);
        const isFuture = dateObj > activeToday || dateObj < window.start;
        const isToday = dateStr === activeTodayStr;

        const dayInfo = daysData[dateStr] || null;
        const count = (!isFuture && dayInfo) ? (dayInfo.count || 0) : 0;

        let level = 0;
        if (count >= 9) level = 4;
        else if (count >= 6) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        weekDays.push({
          dateStr,
          dateObj,
          isFuture,
          isToday,
          count,
          level,
          month: dateObj.getUTCMonth(),
          year: dateObj.getUTCFullYear()
        });

        curr.setUTCDate(curr.getUTCDate() + 1);
      }
      weeks.push(weekDays);
    }

    // Build Months Row
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthsRowHtml = '<div class="activity-months-row">';
    let lastLabeledCol = -10;

    weeks.forEach((week, wIdx) => {
      const firstDay = week[0];
      const prevWeekFirstDay = wIdx > 0 ? weeks[wIdx - 1][0] : null;

      const isNewMonth = !prevWeekFirstDay || (firstDay.month !== prevWeekFirstDay.month);
      if (isNewMonth && (wIdx - lastLabeledCol >= 3) && (wIdx < totalWeeks - 1)) {
        const leftPx = wIdx * 15;
        monthsRowHtml += `<span class="activity-month-label" style="left: ${leftPx}px">${monthNames[firstDay.month]}</span>`;
        lastLabeledCol = wIdx;
      }
    });
    monthsRowHtml += '</div>';

    // Build Grid Body
    let gridBodyHtml = '<div class="activity-grid-body">';

    // Left Day Labels (Mon, Wed, Fri)
    gridBodyHtml += '<div class="activity-days-col">';
    for (let r = 0; r < 7; r++) {
      let label = "";
      if (r === 1) label = "Mon";
      else if (r === 3) label = "Wed";
      else if (r === 5) label = "Fri";
      gridBodyHtml += `<div class="activity-day-label">${label}</div>`;
    }
    gridBodyHtml += '</div>';

    // Weeks Grid
    gridBodyHtml += '<div class="activity-weeks-grid">';
    weeks.forEach((week, wIdx) => {
      gridBodyHtml += `<div class="activity-week-col" data-col="${wIdx}">`;
      week.forEach((day, dIdx) => {
        let classes = `activity-cell lvl-${day.level}`;
        if (day.isFuture) classes = "activity-cell lvl-future";
        if (day.isToday) classes += " cell-today";

        const animDelay = Math.min((wIdx * 12 + dIdx * 8), 650);

        gridBodyHtml += `
          <div class="${classes}"
               data-date="${day.dateStr}"
               data-count="${day.count}"
               data-future="${day.isFuture}"
               style="animation-delay: ${animDelay}ms"
               tabindex="${day.isFuture ? '-1' : '0'}"
               role="gridcell"
               aria-label="${day.dateStr}">
          </div>
        `;
      });
      gridBodyHtml += '</div>';
    });
    gridBodyHtml += '</div>';
    gridBodyHtml += '</div>';

    container.innerHTML = monthsRowHtml + gridBodyHtml;

    attachCellEvents();

    if (scrollArea) {
      requestAnimationFrame(() => {
        scrollArea.scrollLeft = scrollArea.scrollWidth;
      });
    }
  }

  function attachCellEvents() {
    const cells = container.querySelectorAll(".activity-cell:not(.lvl-future)");

    cells.forEach(cell => {
      cell.addEventListener("pointerenter", event => { if (event.pointerType !== 'touch') showTooltip(event); });
      cell.addEventListener("pointerleave", event => { if (event.pointerType !== 'touch') hideTooltip(); });
      cell.addEventListener("click", showTooltip);
      cell.addEventListener("focus", showTooltip);
      cell.addEventListener("blur", hideTooltip);
      cell.addEventListener("touchstart", (e) => {
        showTooltip(e);
      }, { passive: true });
    });


  }

  function showTooltip(e) {
    const cell = e.currentTarget || e.target;
    if (!cell || cell.classList.contains("lvl-future")) return;

    const dateStr = cell.getAttribute("data-date");
    const count = Number(cell.getAttribute("data-count")) || 0;
    if (!dateStr) return;

    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const dateFormatted = dateObj.toLocaleDateString("en-US", options);

    const message = count > 0 
      ? `${count} submission${count === 1 ? '' : 's'} on ${dateFormatted}`
      : `No submissions on ${dateFormatted}`;

    tooltip.textContent = message;

    const rect = cell.getBoundingClientRect();
    const halfWidth = tooltip.offsetWidth / 2;
    const tooltipX = Math.max(halfWidth + 8, Math.min(window.innerWidth - halfWidth - 8, rect.left + rect.width / 2));
    const tooltipY = rect.top;

    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
    tooltip.classList.add("show");
  }

  function hideTooltip() {
    tooltip.classList.remove("show");
  }

  function setupSectionObserver() {
    const section = document.getElementById("coding-activity");
    if (!section || !("IntersectionObserver" in window)) {
      container.classList.add("animated");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          container.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  }
}

