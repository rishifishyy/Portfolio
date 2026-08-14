/**
 * Main Interactive Logic for Dark Theme Developer Portfolio
 * Handles dynamic content rendering, bento grid layout, and project detail modals.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure portfolioData is loaded
  if (typeof portfolioData === "undefined") {
    console.error("portfolioData is missing! Check portfolio-data.js.");
    return;
  }

  renderProfile();
  renderSkills();
  renderExperience();
  renderProjects();
  renderEducation();
  renderLearningSkills();
  setupModalHandlers();
  setupSmoothScroll();
  setupMusicPlayer();
});

/**
 * 1. Render Profile Header & Hero Details
 */
function renderProfile() {
  const { profile } = portfolioData;

  // Header & Title
  const navBrand = document.getElementById("nav-brand-name");
  const heroName = document.getElementById("hero-name");
  const heroTagline = document.getElementById("hero-tagline");
  const footerName = document.getElementById("footer-name");
  const heroAvatar = document.getElementById("hero-avatar");
  const statusBadge = document.getElementById("status-badge-text");
  const statusIndicator = document.getElementById("avatar-status-indicator");
  const aboutSummary = document.getElementById("about-summary-text");
  const currentYear = document.getElementById("current-year");

  if (navBrand) navBrand.textContent = profile.name;
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

  // Toggle status indicator active state
  if (statusIndicator && !profile.statusAvailable) {
    statusIndicator.style.display = "none";
  }

  // Social & Contact Links
  const ctaBtn = document.getElementById("cta-contact-btn");
  const linkLinkedin = document.getElementById("social-linkedin");
  const linkGithub = document.getElementById("social-github");
  const linkCodolio = document.getElementById("social-codolio");
  const footerLinkedin = document.getElementById("footer-linkedin");
  const footerGithub = document.getElementById("footer-github");
  const footerCodolio = document.getElementById("footer-codolio");

  if (ctaBtn && profile.contact.email) {
    ctaBtn.href = profile.contact.email.startsWith("mailto:") 
      ? profile.contact.email 
      : `mailto:${profile.contact.email}`;
  }

  if (linkLinkedin && profile.contact.linkedin) linkLinkedin.href = profile.contact.linkedin;
  if (linkGithub && profile.contact.github) linkGithub.href = profile.contact.github;
  if (linkCodolio && profile.contact.codolio) linkCodolio.href = profile.contact.codolio;

  if (footerLinkedin && profile.contact.linkedin) footerLinkedin.href = profile.contact.linkedin;
  if (footerGithub && profile.contact.github) footerGithub.href = profile.contact.github;
  if (footerCodolio && profile.contact.codolio) footerCodolio.href = profile.contact.codolio;
}

/**
 * 2. Render Core Skills List
 */
function renderSkills() {
  const container = document.getElementById("skills-list");
  if (!container || !portfolioData.profile.skills) return;

  container.innerHTML = portfolioData.profile.skills
    .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
    .join("");
}

/**
 * 3. Render Work Experience Timeline
 */
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

/**
 * 4. Render Work Projects in Staggered Bento Grid
 */
function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container || !portfolioData.projects) return;

  container.innerHTML = portfolioData.projects.map((project, index) => {
    // Apply staggered margin classes for bento layout rhythm
    const staggerClass = (index % 4 === 1) ? 'bento-stagger-1' : (index % 4 === 3) ? 'bento-stagger-3' : '';

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
        class="${cardClass} ${staggerClass}" 
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

  // Attach click & keyboard listeners to each project card
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

/**
 * 5. Render Education
 */
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

/**
 * 6. Render Skills I Am Learning
 */
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
              <span class="learning-badge">
                <span class="learning-pulse-dot"></span>
                In Progress
              </span>
            </div>
            <span class="learning-category">${escapeHtml(skill.category)}</span>
          </div>
        </div>
        <p class="learning-desc">${escapeHtml(skill.description)}</p>
      </div>
    `;
  }).join("");
}

/**
 * 6. Interactive Modal Management
 */
function setupModalHandlers() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (!modal || !closeBtn) return;

  // Close when clicking the close button
  closeBtn.addEventListener("click", closeProjectModal);

  // Close when clicking outside the dialog on the backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Close on Escape key press
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

  // Populate data
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

  // Outcomes list
  if (outcomesEl) {
    outcomesEl.innerHTML = (project.outcomes || [])
      .map(outcome => `<li>${escapeHtml(outcome)}</li>`)
      .join("");
  }

  // Tech stack pills
  if (techStackEl) {
    techStackEl.innerHTML = (project.techStack || [])
      .map(tech => `<span class="skill-tag">${escapeHtml(tech)}</span>`)
      .join("");
  }

  // Action links
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

  // Open modal & lock background scroll
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

/**
 * 7. Smooth Scroll for Navigation Anchors
 */
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

/**
 * 8. HTML5 Background Music Player Controller
 */
let bgAudio = null;
let isMusicPlaying = false;

function setupMusicPlayer() {
  const musicConfig = portfolioData.music || {
    trackTitle: "Lofi Study & Chill Beats",
    artist: "Coding Vibes",
    audioSrc: "assets/lofi-track.mp3"
  };

  const toggleBtn = document.getElementById("music-toggle-btn");
  const btnText = document.getElementById("music-btn-text");
  const floatWidget = document.getElementById("music-float-widget");
  const playBtn = document.getElementById("music-widget-playbtn");
  const playIcon = document.getElementById("music-play-icon");
  const pauseIcon = document.getElementById("music-pause-icon");
  const widgetTitle = document.getElementById("music-widget-title");
  const widgetStatus = document.getElementById("music-widget-status");

  if (widgetTitle) widgetTitle.textContent = musicConfig.trackTitle;

  // Initialize native HTML5 Audio element
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
        if (btnText) btnText.textContent = "Pause Music";
      } else {
        toggleBtn.classList.remove("playing");
        if (btnText) btnText.textContent = "Play Music";
      }
    }

    if (floatWidget) {
      if (playing) {
        floatWidget.classList.add("visible", "playing");
      } else {
        floatWidget.classList.remove("playing");
      }
    }

    if (playIcon && pauseIcon) {
      playIcon.style.display = playing ? "none" : "block";
      pauseIcon.style.display = playing ? "block" : "none";
    }

    if (widgetStatus) {
      widgetStatus.textContent = playing ? "Now Playing" : "Paused";
    }
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleMusic);
  if (playBtn) playBtn.addEventListener("click", toggleMusic);
}

/**
 * Helper utility to prevent XSS injection
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
