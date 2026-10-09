(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const canvas = document.getElementById('portfolio-ambient-canvas');
  const context = canvas?.getContext('2d');
  if (!themeButton) return;
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  // Ignore the former toggle's saved state so motion cannot remain stuck off.
  root.dataset.motion = 'on';
  let frame = 0, lastTime = 0, elapsed = 0, width = 0, height = 0, compact = false;
  let glowSprites = [], lineGradient, cursor = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let renderInterval = 33, paintCost = 0, scrollOffset = 0, targetScroll = 0;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let palette = {};
  const dialogs = ['snake-modal', 'project-modal', 'mobile-nav-drawer'].map(id => document.getElementById(id)).filter(Boolean);
  const hasOpenDialog = () => dialogs.some(dialog => dialog.classList.contains('open'));
  function updateControls() {
    const target = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${target} theme`);
    themeButton.title = `Switch to ${target} theme`;
  }
  function updatePalette() {
    palette = root.dataset.theme === 'light'
      ? { colors: ['44,146,166', '111,99,198'], light: '45,99,155', lineAlpha: .35, glowAlpha: .18 }
      : { colors: ['65,184,190', '136,116,214'], light: '186,235,240', lineAlpha: .38, glowAlpha: .23 };
    glowSprites = palette.colors.map(color => {
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 256;
      const ctx = sprite.getContext('2d');
      if (!ctx) return null;
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, `rgba(${color},${palette.glowAlpha})`);
      gradient.addColorStop(.35, `rgba(${color},${palette.glowAlpha * .55})`);
      gradient.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256);
      return sprite;
    });
    updateGradient(); updateControls();
  }
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    save('portfolio-theme', root.dataset.theme); updatePalette(); paint();
    document.dispatchEvent(new Event('portfolio-theme-change'));
  });
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-theme' && ['light', 'dark'].includes(event.newValue)) {
      root.dataset.theme = event.newValue; updatePalette(); paint();
      document.dispatchEvent(new Event('portfolio-theme-change'));
    }
  });
  function updateGradient() {
    if (!context || !width) return;
    lineGradient = context.createLinearGradient(0, height, width, 0);
    lineGradient.addColorStop(0, `rgba(${palette.colors[1]},${palette.lineAlpha})`);
    lineGradient.addColorStop(.5, `rgba(${palette.colors[0]},${palette.lineAlpha * .65})`);
    lineGradient.addColorStop(1, `rgba(${palette.colors[0]},${palette.lineAlpha})`);
  }
  function resize() {
    if (!context) return;
    width = window.innerWidth; height = window.innerHeight; compact = width < 768;
    const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5, Math.sqrt(3200000 / (width * height)));
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    renderInterval = compact ? 50 : 33;
    paintCost = 0; updateGradient(); paint();
  }
  function curve(side, index) {
    const gap = compact ? 10 : 13;
    const spread = index * gap;
    const drift = Math.sin(elapsed * .55 + side * 2) * (compact ? 48 : 88);
    const bend = Math.cos(elapsed * .4 + index * .09) * 40;
    const px = cursor.x * .018, py = cursor.y * .018 + scrollOffset;
    return side === 0
      ? [[width * 1.12, -height * .2 + spread],
         [width * (compact ? .35 : .56) + drift + px, height * .12 + spread + bend + py],
         [width * (compact ? .6 : .85) - drift + px, height * .52 + spread * .4 + py],
         [width * 1.16, height * .92 + spread]]
      : [[-width * .16, height * .03 + spread],
         [width * (compact ? .5 : .34) + drift + px, height * .42 + spread + py],
         [-width * .28 - drift + px, height * .82 + spread * .3 + bend + py],
         [width * .26, height * 1.2 + spread]];
  }
  function pointOnCurve(points, t) {
    const u = 1 - t;
    return [0, 1].map(axis => u * u * u * points[0][axis] + 3 * u * u * t * points[1][axis]
      + 3 * u * t * t * points[2][axis] + t * t * t * points[3][axis]);
  }
  function paint() {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    const size = Math.min(Math.max(width * .68, height * .8), 1400);
    glowSprites.forEach((sprite, i) => {
      if (!sprite) return;
      const x = width * (i ? .03 : .93) + Math.sin(elapsed * .3 + i * 3) * 100 + cursor.x * .012;
      const y = height * (i ? .78 : .24) + Math.cos(elapsed * .38 + i * 2) * 75 + scrollOffset;
      context.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    });
    const count = compact ? 9 : 15;
    context.lineWidth = compact ? .75 : .85;
    for (let side = 0; side < 2; side++) {
      context.strokeStyle = lineGradient;
      for (let i = 0; i < count; i++) {
        const points = curve(side, i - count / 2);
        context.beginPath(); context.moveTo(...points[0]);
        context.bezierCurveTo(...points[1], ...points[2], ...points[3]); context.stroke();
      }
      for (let i = 0; i < (compact ? 1 : 2); i++) {
        const t = (elapsed * .09 + i * .47 + side * .31) % 1;
        const points = curve(side, i * 5 - 3);
        const visibility = Math.sin(t * Math.PI);
        context.lineWidth = 1.5;
        for (let segment = 0; segment < 12; segment++) {
          const p0 = pointOnCurve(points, Math.max(0, t - .055 + segment * .0045));
          const p1 = pointOnCurve(points, Math.max(0, t - .055 + (segment + 1) * .0045));
          context.strokeStyle = `rgba(${palette.light},${segment / 12 * visibility * .9})`;
          context.beginPath(); context.moveTo(...p0); context.lineTo(...p1); context.stroke();
        }
        const head = pointOnCurve(points, t);
        context.fillStyle = `rgba(${palette.light},${visibility * .9})`;
        context.beginPath(); context.arc(...head, 2.2, 0, Math.PI * 2); context.fill();
      }
      context.lineWidth = compact ? .75 : .85;
    }
  }
  function animate(time) {
    frame = 0;
    if (document.hidden || hasOpenDialog()) return;
    if (time - lastTime >= renderInterval) {
      elapsed += Math.min((time - lastTime) / 1000, .1); lastTime = time;
      cursor.x += (cursor.targetX - cursor.x) * .06; cursor.y += (cursor.targetY - cursor.y) * .06;
      scrollOffset += (targetScroll - scrollOffset) * .07;
      const started = performance.now(); paint();
      paintCost = paintCost * .9 + (performance.now() - started) * .1;
      if (paintCost > 10) renderInterval = 66;
    }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    const paused = document.hidden || hasOpenDialog();
    document.body.classList.toggle('ambient-paused', paused);
    paint(); lastTime = performance.now();
    if (context && !paused) frame = requestAnimationFrame(animate);
  }
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0; resize();
      const drawer = document.getElementById('mobile-nav-drawer');
      if (width > 1100 && drawer?.classList.contains('open')) document.getElementById('mobile-menu-btn').click();
    });
  }, { passive: true });
  window.addEventListener('pointermove', event => {
    if (compact || !finePointer.matches || event.pointerType === 'touch') return;
    cursor.targetX = event.clientX - width / 2; cursor.targetY = event.clientY - height / 2;
  }, { passive: true });
  window.addEventListener('pointerout', event => {
    if (!event.relatedTarget) cursor.targetX = cursor.targetY = 0;
  }, { passive: true });
  window.addEventListener('scroll', () => {
    targetScroll = -Math.min(window.scrollY, height * 2) * .025;
  }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  window.addEventListener('pageshow', sync);
  if (!finePointer.matches) cursor.targetX = cursor.targetY = 0;
  updatePalette(); resize(); sync();
  for (const dialog of dialogs) {
    dialog.inert = !dialog.classList.contains('open');
    let opener;
    const observer = new MutationObserver(() => {
      const open = dialog.classList.contains('open');
      const containedFocus = dialog.contains(document.activeElement);
      dialog.inert = !open;
      if (open) {
        opener = document.activeElement;
        const first = dialog.querySelector('button, a[href], [tabindex="0"]');
        if (!dialog.contains(document.activeElement)) first?.focus({ preventScroll: true });
      } else if (opener && containedFocus) opener.focus({ preventScroll: true });
      sync();
    });
    observer.observe(dialog, {attributes: true, attributeFilter: ['class']});
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !dialog.classList.contains('open')) return;
      const focusable = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
})();
