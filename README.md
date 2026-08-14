# ✨ Dark Theme Developer Portfolio - Rishi Nehra

A high-performance, dark-themed personal portfolio website built with vanilla HTML, modern CSS design tokens, and vanilla JavaScript. Features a sleek blueprint grid matrix background, interactive project modals, and integrated profile links for LinkedIn, GitHub, and Codolio.

---

## 🚀 Features

- 🌑 **Sleek Obsidian Dark Theme**: Custom blueprint grid background (`56px 56px`), subtle ambient glows, and glassmorphic top navigation.
- ⚡ **Interactive Profile Hero**: Active "Open to Work" pulsating green badge, customizable avatar, and glare-animated "Get in touch" CTA button.
- 📊 **Codolio & Competitive Coding Integration**: Direct link to your live Codolio coding profile tracker with dedicated icon.
- 💼 **Work Experience Timeline**: Company badges, roles, duration chips, detailed summaries, and tech tags.
- 🧱 **Bento Project Grid**: Staggered cards with preview visuals, category tags, hover zoom effects, and view buttons.
- 🔍 **Interactive Project Modal**: Deep-dive popup dialog displaying overview, problem statement, solution & approach, key outcomes list, tech stack tags, and live demo / GitHub links. Supports keyboard shortcuts (`Esc`) and backdrop dismiss.
- 🏆 **Achievements & Milestones**: Track problem solving streaks, hackathons, and open source contributions.
- 🛠️ **Single Config File (`portfolio-data.js`)**: Update all your info in one place!

---

## 📁 File Structure

```text
Portfolio/
├── index.html            # Semantic markup & OpenGraph tags
├── style.css             # Dark theme design system & animations
├── script.js             # Project modal & dynamic DOM rendering
├── portfolio-data.js     # ⚙️ Centralized data config (edit your info here!)
├── assets/               # Visual previews & avatar assets
│   ├── avatar.png
│   ├── roomsketch-preview.svg
│   ├── solwill-preview.svg
│   ├── agentflow-preview.svg
│   └── dexmatrix-preview.svg
├── .gitignore            # Git ignore rules
└── README.md             # Documentation & deployment guide
```

---

## 🐙 How to Push to GitHub

Follow these steps in PowerShell inside the `Portfolio` folder:

### 1. Initialize Git (if not already initialized)
```bash
cd "c:\WEB DEV HTML\Portfolio"
git init
git branch -M main
```

### 2. Stage and Commit Your Files
```bash
git add .
git commit -m "feat: setup Rishi Nehra portfolio with dark theme and Codolio tracker"
```

### 3. Create a new repository on GitHub
- Go to [github.com/new](https://github.com/new)
- Name your repository (e.g. `portfolio` or `rishi-portfolio`)
- Keep it Public (or Private) and **do not** initialize with a README
- Click **Create repository**

### 4. Link Remote and Push
```bash
git remote add origin https://github.com/rishifishyy/portfolio.git
git push -u origin main
```

---

## 🚀 Free Live Deployment

### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** -> Select your `portfolio` repository.
3. Click **Deploy**. Vercel will instantly give you a live URL with SSL!

### Option B: GitHub Pages
1. Go to your GitHub repository -> **Settings** -> **Pages**.
2. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
