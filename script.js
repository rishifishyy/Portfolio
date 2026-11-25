document.addEventListener("DOMContentLoaded", () => {
  setupContourMotion();
  renderProfile();
  renderExperience();
  renderProjects();
  renderEducation();
  setupLearning();
  setupSnakeGame();
  initCodingActivity();
});

function setupContourMotion() {
  const backdrop = document.querySelector(".contour-background");
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;

  function update() {
    frame = 0;
    const scrollOffset = 55 * Math.sin(window.scrollY / 320);
    backdrop.style.setProperty("--contour-x", `${pointerX}px`);
    backdrop.style.setProperty("--contour-y", `${pointerY + scrollOffset}px`);
  }

  function queueUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    pointerX = (event.clientX / window.innerWidth - 0.5) * 120;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 90;
    queueUpdate();
  }, { passive: true });
  window.addEventListener("scroll", queueUpdate, { passive: true });
  queueUpdate();
}

function renderProfile() {
  const { profile } = portfolioData;
  document.getElementById("hero-tagline").textContent = profile.tagline;
  document.getElementById("about-summary-text").textContent = profile.summary;
  document.getElementById("availability").hidden = !profile.statusAvailable;
  document.getElementById("status-badge-text").textContent = profile.statusBadge;
  document.getElementById("current-year").textContent = new Date().getFullYear();
  document.getElementById("skills-list").innerHTML = renderListItems(profile.skills);

  for (const link of document.querySelectorAll("[data-contact]")) {
    const channel = link.dataset.contact;
    if (channel === "email") {
      link.href = profile.contact.mailUrl;
      link.addEventListener("click", () => copyEmailToClipboard(profile.contact.email));
    } else {
      link.href = profile.contact[channel];
    }
  }
}

function renderListItems(items) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderExperience() {
  document.getElementById("experience-list").innerHTML = portfolioData.experiences.map(exp => `
    <article class="entry-row" id="${escapeHtml(exp.id)}">
      <div class="entry-meta">
        <span>${escapeHtml(exp.company)}</span>
        <span>${escapeHtml(exp.duration)}</span>
      </div>
      <div class="entry-content">
        <h3>${escapeHtml(exp.role)}</h3>
        <p>${escapeHtml(exp.summary)}</p>
      </div>
    </article>
  `).join("");
}

function renderProjects() {
  const container = document.getElementById("projects-grid");
  const modal = document.getElementById("project-modal");

  container.innerHTML = portfolioData.projects.map(project => {
    const metadata = escapeHtml(project.isComingSoon ? `${project.type} · In progress` : project.type);
    const title = `
      <h3>
        <button type="button" class="project-trigger" data-project-id="${escapeHtml(project.id)}" aria-haspopup="dialog" aria-controls="project-modal">${escapeHtml(project.title)}</button>
      </h3>
    `;
    const description = `<p class="project-description">${escapeHtml(project.shortDescription)}</p>`;

    if (project.featured) {
      const responsiveImage = project.imageSrcset
        ? `srcset="${escapeHtml(project.imageSrcset)}" sizes="(min-width: 1056px) 594px, (min-width: 673px) 56vw, 92vw"`
        : "";

      return `
        <article class="project-row is-featured">
          <figure class="project-visual">
            <img src="${escapeHtml(project.image)}" ${responsiveImage} alt="${escapeHtml(project.imageAlt || project.title)}" decoding="async">
          </figure>
          <div class="project-feature-info">
            ${title}
            ${description}
            <p class="project-meta">${project.techStack.slice(0, 4).map(escapeHtml).join(" / ")}</p>
            <span class="project-cta" aria-hidden="true">View project <span>→</span></span>
          </div>
        </article>
      `;
    }

    return `
      <article class="project-row">
        <div>
          ${title}
          <p class="project-meta">${metadata}</p>
        </div>
        ${description}
        <span class="project-arrow" aria-hidden="true">→</span>
      </article>
    `;
  }).join("");

  container.addEventListener("click", event => {
    const trigger = event.target.closest(".project-trigger");
    if (trigger) openProjectModal(modal, trigger.dataset.projectId);
  });
  setupDialogDismissal(modal, document.getElementById("modal-close-btn"));
}

function renderEducation() {
  document.getElementById("education-list").innerHTML = portfolioData.education.map(education => `
    <article class="entry-row" id="${escapeHtml(education.id)}">
      <div class="entry-meta">
        <span>${escapeHtml(education.duration)}</span>
        <span>${escapeHtml(education.score)}</span>
      </div>
      <div class="entry-content">
        <h3>${escapeHtml(education.degree)}</h3>
        <p>${escapeHtml(education.institution)}</p>
      </div>
    </article>
  `).join("");
}

function setupLearning() {
  const details = document.getElementById("learning-details");

  function loadDemo() {
    if (!details.open) return;
    details.removeEventListener("toggle", loadDemo);
    window.PORTFOLIO_LEARNING_SKILLS = portfolioData.learningSkills;
    const script = document.createElement("script");
    script.src = "learning.bundle.js?v=1.1";
    script.async = true;
    script.addEventListener("error", () => {
      script.remove();
      details.addEventListener("toggle", loadDemo);
    }, { once: true });
    document.body.appendChild(script);
  }

  details.addEventListener("toggle", loadDemo);
  loadDemo();
}

function setupDialogDismissal(dialog, closeButton) {
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
      dialog.close();
    }
  });
}

function openProjectModal(modal, projectId) {
  const project = portfolioData.projects.find(item => item.id === projectId);
  if (!project || modal.open) return;

  document.getElementById("modal-project-title").textContent = project.title;
  document.getElementById("modal-project-type").textContent = project.type;

  const image = document.getElementById("modal-project-img");
  if (project.imageSrcset) {
    image.sizes = "(min-width: 900px) 824px, 86vw";
    image.srcset = project.imageSrcset;
  } else {
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
  }
  image.src = project.image;
  image.alt = project.imageAlt || project.title;
  image.parentElement.classList.toggle("project-media-wide", Boolean(project.previewAspect));

  document.getElementById("modal-project-overview").textContent = project.fullDescription || project.shortDescription;
  document.getElementById("modal-project-outcomes").innerHTML = renderListItems(project.outcomes || []);
  document.getElementById("modal-project-techstack").innerHTML = renderListItems(project.techStack || []);

  for (const [id, url] of [
    ["modal-live-link", project.links?.live],
    ["modal-github-link", project.links?.github]
  ]) {
    const link = document.getElementById(id);
    link.hidden = !url;
    if (url) link.href = url;
    else link.removeAttribute("href");
  }

  modal.showModal();
  modal.querySelector(".modal-body").scrollTop = 0;
}

function setupSnakeGame() {
  const modal = document.getElementById("snake-modal");
  const openButton = document.getElementById("game-toggle-btn");
  const closeButton = document.getElementById("snake-close-btn");
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
  if (scoreClient.getState().pending) void loadBestScore();

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
    context.fillStyle = "#07110a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    context.strokeStyle = "rgba(135, 181, 89, 0.08)";
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
        context.strokeStyle = `rgba(130, 185, 60, ${Math.max(0.68, ratio)})`;
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
      context.fillStyle = "#d7f886";
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
    if (modal.open) return;
    modal.showModal();
    modal.scrollTop = 0;
    scoreClient.setActive(!document.hidden);
    if (!running) resetGame();
  }

  function closeGame() {
    pauseGame();
    scoreClient.setActive(false);
  }

  openButton.addEventListener("click", openGame);
  modal.addEventListener("close", closeGame);
  setupDialogDismissal(modal, closeButton);
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
    button.addEventListener("click", event => {
      if (event.detail === 0) handleControlInput(event);
    });
  });

  // Keyboard controls (Desktop)
  document.addEventListener("keydown", (event) => {
    if (!modal.open) return;
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
    if (event.key === " " && !event.target.closest("button")) {
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
    if (!modal.open) return;
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
    scoreClient.setActive(!document.hidden && modal.open);
  });
  window.addEventListener("online", () => {
    if (modal.open || scoreClient.getState().pending) void loadBestScore();
  });
  window.addEventListener("pagehide", () => scoreClient.setActive(false));
  window.addEventListener("pageshow", () => scoreClient.setActive(!document.hidden && modal.open));
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

let toastTimeout;

function copyEmailToClipboard(email) {
  navigator.clipboard?.writeText(email)
    .then(() => {
      let toast = document.getElementById("portfolio-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "portfolio-toast";
        toast.className = "portfolio-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }

      toast.textContent = "Email address copied";
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.remove(), 3000);
    })
    .catch(() => {
      // The email link can still open when clipboard access is denied.
    });
}

function initCodingActivity() {
  const container = document.getElementById("activity-calendar");
  if (!container) return;

  const scrollArea = document.getElementById("activity-scroll-area");
  const weekdays = document.getElementById("activity-weekdays");
  const tooltip = document.getElementById("activity-tooltip");
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric"
  });
  const monthFormatter = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "short" });
  const { DAY_MS, dateKey } = ActivityCalendar;
  let selectedDate = null;
  let tooltipCell = null;
  let followingLatest = true;

  // Fetch combined activity data
  async function loadData() {
    const local = ["localhost", "127.0.0.1"].includes(window.location?.hostname) || window.location?.hostname?.endsWith(".netlify.app");
    const apiUrl = !local && window.PORTFOLIO_ACTIVITY_API
      ? window.PORTFOLIO_ACTIVITY_API : "/api/coding-activity";
    try {
      const res = await fetch(apiUrl, {
        cache: "no-store",
        signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(30000) : undefined
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
      if (fallbackRes.ok) return { ...await fallbackRes.json(), stale: true };
    } catch (err) {
      console.error("Failed to load activity fallback data:", err);
    }
    return null;
  }

  let loading = false, lastLoadTime = 0, renderedDay = null, chartKey = null, latestData = null;
  async function refreshCalendar() {
    const today = ActivityCalendar.range(new Date()).endDate;
    if (renderedDay && renderedDay !== today) renderTodayQuestions(null);
    if (loading) return;
    const ttl = latestData?.stale ? 30000 : 5 * 60 * 1000;
    if (latestData && renderedDay === today && Date.now() - lastLoadTime < ttl) return;
    loading = true;
    try {
      const data = await loadData();
      if (!data) {
        if (!chartKey) {
          container.innerHTML = '<p class="activity-calendar-loading" role="status">Unable to load coding activity.</p>';
        }
        renderTodayQuestions(null);
        return;
      }
      latestData = data;
      lastLoadTime = Date.now();
      renderCalendar(data);
      renderedDay = today;
    } finally {
      loading = false;
    }
  }

  container.addEventListener("pointerover", event => {
    if (event.pointerType === "touch") return;
    const cell = event.target.closest(".activity-cell");
    if (cell) showTooltip(cell);
  });
  container.addEventListener("pointerout", event => {
    if (event.pointerType !== "touch" && event.target === tooltipCell) hideTooltip();
  });
  container.addEventListener("click", selectFromEvent);
  container.addEventListener("focusin", selectFromEvent);
  container.addEventListener("focusout", hideTooltip);
  container.addEventListener("keydown", navigateCalendar);

  document.addEventListener("pointerdown", event => {
    if (!container.contains(event.target)) hideTooltip();
  });
  window.addEventListener("scroll", positionTooltip, { capture: true, passive: true });
  window.addEventListener("resize", positionTooltip, { passive: true });

  if (scrollArea) {
    const updateScrollPosition = () => {
      followingLatest = scrollArea.scrollLeft >= scrollArea.scrollWidth - scrollArea.clientWidth - 2;
    };
    scrollArea.addEventListener("scroll", updateScrollPosition, { passive: true });
    const handleResize = () => {
      if (followingLatest) scrollArea.scrollLeft = scrollArea.scrollWidth;
      updateScrollPosition();
    };
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(handleResize).observe(scrollArea);
    else window.addEventListener("resize", handleResize, { passive: true });
  }

  refreshCalendar();
  setInterval(() => { if (!document.hidden) refreshCalendar(); }, 5 * 60 * 1000);
  setInterval(() => {
    if (!document.hidden && renderedDay !== ActivityCalendar.range(new Date()).endDate) refreshCalendar();
  }, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshCalendar(); });

  function renderTodayQuestions(data) {
    const content = document.getElementById("today-solved-content");
    if (!content) return;
    const now = new Date();
    const today = ActivityCalendar.range(now).endDate;
    const dateLabel = new Date(today + "T00:00:00Z").toLocaleDateString("en-IN", {
      timeZone: "UTC", day: "numeric", month: "short", year: "numeric"
    });
    const details = data?.solvedToday?.date === today ? data.solvedToday : null;
    const escape = value => String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
    const links = ["leetcode", "gfg"].map(platform => {
      const source = details?.platforms?.[platform];
      const questions = (source?.questions || []).filter(question => {
        const solved = new Date(question.solvedAt);
        return question.title && question.slug && !Number.isNaN(solved.getTime()) && solved <= now
          && ActivityCalendar.range(solved).endDate === today;
      });
      return questions.map(question => {
        const url = platform === "leetcode"
          ? `https://leetcode.com/problems/${encodeURIComponent(question.slug)}/`
          : `https://www.geeksforgeeks.org/problems/${encodeURIComponent(question.slug)}/1`;
        return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${escape(question.title)} <span aria-hidden="true">↗</span></a></li>`;
      }).join("");
    }).join("");
    const html = `<p class="today-solved-date">${dateLabel}</p>${links ? `<ul class="today-solved-list">${links}</ul>` : ""}`;
    if (content.innerHTML !== html) content.innerHTML = html;
  }

  function renderCalendar(data) {
    const now = new Date();
    renderTodayQuestions(data);
    const { days } = ActivityCalendar.summarize(data.days || {}, now);
    const { start, end, startDate, endDate } = ActivityCalendar.range(now);
    const nextChartKey = JSON.stringify([endDate, days]);
    if (chartKey === nextChartKey) return;

    const previousScroll = scrollArea?.scrollLeft ?? 0;
    const showLatest = chartKey === null || followingLatest;
    const restoreFocus = document.activeElement?.classList.contains("activity-cell");
    chartKey = nextChartKey;
    if (!selectedDate || (selectedDate === renderedDay && showLatest) || selectedDate < startDate || selectedDate > endDate) {
      selectedDate = endDate;
    }

    const firstSunday = start.getTime() - start.getUTCDay() * DAY_MS;
    const weekCount = Math.ceil(((end.getTime() - firstSunday) / DAY_MS + 1) / 7);
    const months = [];
    const weeks = Array.from({ length: weekCount }, (_, column) => {
      const cells = Array.from({ length: 7 }, (_, weekday) => {
        const date = new Date(firstSunday + (column * 7 + weekday) * DAY_MS);
        const key = dateKey(date);
        if (key < startDate || key > endDate) return '<span aria-hidden="true"></span>';

        if (key === startDate || date.getUTCDate() === 1) {
          const previous = months.at(-1);
          if (previous && column - previous.column < 2) months.pop();
          months.push({ column, label: monthFormatter.format(date) });
        }

        const count = days[key]?.count || 0;
        const level = count === 0 ? 0 : Math.min(4, 1 + Math.floor(count / 3));
        const today = key === endDate;
        const selected = key === selectedDate;
        return `<button type="button" class="activity-cell lvl-${level}${today ? " cell-today" : ""}"
          data-date="${key}" data-count="${count}" tabindex="${selected ? 0 : -1}"
          aria-label="${dateFormatter.format(date)} · ${submissionLabel(count)}"${today ? ' aria-current="date"' : ""}></button>`;
      });
      return `<div class="activity-week-col">${cells.join("")}</div>`;
    });

    const monthLabels = months.map(({ column, label }) => {
      const endClass = column === weekCount - 1 ? " activity-month-label-end" : "";
      return `<span class="activity-month-label${endClass}" style="grid-column: ${column + 1}">${label}</span>`;
    }).join("");

    hideTooltip();
    container.innerHTML = `
      <div class="activity-months-row" style="--activity-week-count: ${weekCount}" aria-hidden="true">${monthLabels}</div>
      <div class="activity-weeks-grid">${weeks.join("")}</div>`;
    if (weekdays) weekdays.hidden = false;

    if (scrollArea) {
      scrollArea.scrollLeft = showLatest ? scrollArea.scrollWidth : previousScroll;
    }
    if (restoreFocus) findCell(selectedDate)?.focus({ preventScroll: true });
  }

  function submissionLabel(count) {
    return `${count} submission${count === 1 ? "" : "s"}`;
  }

  function showTooltip(cell) {
    if (!tooltip) return;
    tooltipCell = cell;
    tooltip.textContent = cell.getAttribute("aria-label");
    tooltip.hidden = false;
    positionTooltip();
  }

  function hideTooltip() {
    tooltipCell = null;
    if (tooltip) tooltip.hidden = true;
  }

  function positionTooltip() {
    if (!tooltipCell) return;
    const cell = tooltipCell.getBoundingClientRect();
    const chart = scrollArea.getBoundingClientRect();
    if (cell.right <= chart.left || cell.left >= chart.right || cell.bottom <= 0 || cell.top >= window.innerHeight) {
      hideTooltip();
      return;
    }

    const { offsetWidth: width, offsetHeight: height } = tooltip;
    const left = cell.left + (cell.width - width) / 2;
    const above = cell.top - height - 6;
    tooltip.style.left = `${Math.max(8, Math.min(left, window.innerWidth - width - 8))}px`;
    tooltip.style.top = `${above >= 8 ? above : cell.bottom + 6}px`;
  }

  function findCell(date) {
    return date ? container.querySelector(`.activity-cell[data-date="${date}"]`) : null;
  }

  function selectFromEvent(event) {
    const cell = event.target.closest(".activity-cell");
    if (!cell) return;

    const date = cell.dataset.date;
    if (date !== selectedDate) {
      findCell(selectedDate).tabIndex = -1;
      selectedDate = date;
      cell.tabIndex = 0;
    }
    showTooltip(cell);
  }

  function navigateCalendar(event) {
    const cell = event.target.closest(".activity-cell");
    if (!cell) return;
    if (event.key === "Escape") {
      hideTooltip();
      return;
    }

    const day = new Date(`${cell.dataset.date}T00:00:00Z`);
    const steps = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    let next;
    if (event.key === "Home") {
      next = container.querySelector(".activity-cell");
    } else if (event.key === "End") {
      next = container.querySelector(".cell-today");
    } else if (Object.hasOwn(steps, event.key)) {
      const weekday = day.getUTCDay();
      if ((event.key !== "ArrowUp" || weekday > 0) && (event.key !== "ArrowDown" || weekday < 6)) {
        day.setUTCDate(day.getUTCDate() + steps[event.key]);
        next = findCell(dateKey(day));
      }
    } else {
      return;
    }
    event.preventDefault();
    if (!next) return;
    next.focus();
    if (scrollArea && event.key === "Home") scrollArea.scrollLeft = 0;
    if (scrollArea && event.key === "End") scrollArea.scrollLeft = scrollArea.scrollWidth;
    showTooltip(next);
  }
}
