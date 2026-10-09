window.PORTFOLIO_SNAKE_API = "https://rishifishyy-portfolio-activity.netlify.app/api/snake-best";
window.PORTFOLIO_ACTIVITY_API = "https://rishifishyy-portfolio-activity.netlify.app/api/coding-activity";

const portfolioData = {
  profile: {
    name: "Rishi Nehra",
    tagline: "Full Stack Developer | Software Engineer | Problem Solver",
    statusBadge: "Open to Work",
    statusAvailable: true,
    avatarUrl: "assets/avatar.png",
    summary: `I'm a passionate Full-Stack Developer focused on building clean, high-performance web applications and scalable software systems.

I love to tackle algorithmic challenges and design interactive frontend interfaces. Always curious and actively learning new technologies.`,
    contact: {
      email: "rishinehra1@gmail.com",
      mailUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=rishinehra1@gmail.com",
      github: "https://github.com/rishifishyy",
      linkedin: "https://www.linkedin.com/in/rishi-nehra-78274a1a0/",
      codolio: "https://codolio.com/profile/rishifishyy",
      leetcode: "https://leetcode.com/u/rishifishyy/",
      gfg: "https://www.geeksforgeeks.org/profile/rishifishyy?tab=activity",
      resume: "https://drive.google.com/file/d/1BeZnAko11LOQJIrppl92JM5njJelI8dp/view?usp=sharing"
    },
    skills: [
      "React.js",
      "JavaScript (ES6+)",
      "Node.js",
      "Express.js",
      "C++",
      "Data Structures",
      "SQL",
      "MongoDB",
      "Tailwind CSS",
      "Git & GitHub",
      "REST APIs"
    ]
  },

  music: {
    idleText: "Play Music",
    trackTitle: "Just Chill and Code",
    artist: "Lofi Vibes",
    audioSrc: "assets/chill-beat.mp3"
  },

  learningSkills: [
    {
      id: "learn-python",
      name: "Python",
      category: "Programming & Automation",
      description: "Learning the language through small scripts, object-oriented programming, and everyday automation.",
      topics: ["Fundamentals", "OOP", "Automation"]
    },
    {
      id: "learn-ai",
      name: "Artificial Intelligence",
      category: "AI Foundations & Applications",
      description: "Understanding machine learning basics and experimenting with language models in web applications.",
      topics: ["Machine learning", "Language models", "AI integration"]
    }
  ],

  experiences: [
    {
      id: "exp-tcs",
      company: "Tata Consultancy Services (TCS)",
      role: "System Engineer",
      duration: "Placed • Awaiting Joining",
      summary: "Placed at TCS as a System Engineer (awaiting joining/onboarding). Preparing for enterprise software development, system architecture, and engineering workflows.",
      technologies: ["System Engineering", "C++", "SQL", "Software Development", "Problem Solving"],
      logoUrl: "assets/tcs.png",
      logoText: "TCS",
      logoColor: "#000000"
    },
    {
      id: "exp-oasis",
      company: "Oasis Infobyte",
      role: "Web Development Intern",
      duration: "Jun 2025 - Jul 2025",
      summary: "Worked on various full-stack and frontend web projects that helped master the MERN stack (MongoDB, Express.js, React.js, Node.js), responsive user interfaces, and API integrations.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "HTML5/CSS3"],
      logoUrl: "assets/oasis-infobyte.png",
      logoText: "OI",
      logoColor: "#101820"
    }
  ],

  projects: [
    {
      id: "team-up",
      title: "TeamUP",
      type: "Full Stack Web App / MERN",
      badge: "Live App",
      shortDescription: "A real-time matchmaking & squad finder platform that connects players across 8 global server regions with live invites and in-app chat.",
      fullDescription: "TeamUP is a full-stack player matchmaking web application engineered to eliminate the frustration of random queues. It connects competitive and casual gamers across 8 official server regions, matching them by Game Mode, Build Setting, Platform, Mic preference, and Languages with live matchmaking pools and integrated real-time match chat.",
      image: "assets/teamup-home.png",
      imageSrcset: "assets/teamup-home-small.png 954w, assets/teamup-home.png 1908w",
      imageAlt: "TeamUP homepage with the Good games, Great teammates headline and squad matching radar",
      previewAspect: "wide",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Framer Motion", "Tailwind CSS", "REST APIs", "Render"],
      outcomes: [
        "Live player matchmaking pool supporting 8 server regions and custom mode filters",
        "Interactive request workflow with match notifications, toast alerts, and live in-browser chat",
        "Fully deployed and accessible with live demo on Render and open source on GitHub"
      ],
      links: {
        live: "https://teamup-x5fq.onrender.com/",
        github: "https://github.com/rishifishyy/teamUP"
      }
    },
    {
      id: "ai-exam-notes",
      title: "AI Exam Notes",
      type: "AI & Full Stack Web App",
      badge: "Open Source",
      shortDescription: "An AI-powered study companion that helps students generate concise exam notes, high-yield summaries, and quick-revision flashcards.",
      fullDescription: "AI Exam Notes is an intelligent web application designed to accelerate exam preparation. It takes lecture notes, textbook passages, or topic outlines and uses AI to distill them into crisp summaries, formula cheat sheets, and predicted high-probability exam questions.",
      image: "assets/aiexamnotes-preview.svg",
      techStack: ["React.js", "Node.js", "Express.js", "JavaScript", "Tailwind CSS", "REST APIs", "AI Integration"],
      outcomes: [
        "Instant summarization and exam note extraction using AI prompts",
        "Clean, responsive study interface with copy-to-clipboard and export options",
        "Open-source repository available on GitHub"
      ],
      links: {
        github: "https://github.com/rishifishyy/aiexamnotes"
      }
    },
    {
      id: "digital-chalisa",
      title: "Digital Chalisa",
      type: "Devotional Audio Web App",
      badge: "Live App",
      shortDescription: "A devotional player for six Chalisas with synchronized audio, Hindi and Romanized English lyrics, and customizable playback.",
      fullDescription: "Digital Chalisa brings Hanuman, Shiva, Durga, Ganesh, Shani, and Saraswati Chalisa into one responsive devotional player. Choose a prayer to load its recording, artwork, and bilingual lyrics. Timed lyric cues highlight the current verse and scroll with the audio, while clicking a verse seeks directly to that part of the recitation.",
      image: "assets/digital-chalisa-preview.png",
      techStack: ["HTML5", "CSS3", "JavaScript", "HTML5 Audio", "JSON", "LocalStorage"],
      outcomes: [
        "Six Chalisas with a prayer selector that updates the audio, lyrics, artwork, and devotional accent",
        "Hindi and Romanized English lyrics with active-verse highlighting, automatic scrolling, and verse seeking",
        "Play/pause, five-second skips, volume, playback speed, continuous looping, and a recitation counter",
        "Light and dark themes, adjustable lyric size, and remembered prayer, language, and appearance preferences",
        "Responsive layouts, keyboard controls, and devotional animations that respect reduced-motion preferences"
      ],
      links: {
        live: "https://digitalchalisa.netlify.app/"
      }
    },
    {
      id: "crypto-tracker",
      title: "Crypto Portfolio Tracker",
      type: "FinTech / MERN Stack",
      badge: "Currently Working",
      isComingSoon: true,
      shortDescription: "A comprehensive crypto portfolio tracker with real-time pictorial charts, balance breakdown, and automated best vs worst performer analytics.",
      fullDescription: "Currently developing a full-featured cryptocurrency portfolio tracking dashboard built on the MERN stack. It connects to live crypto market feeds to give users visual representations of their asset allocation, 30-day profit/loss trends, and spotlight alerts for top gainers and biggest losers in their portfolio.",
      image: "assets/crypto-tracker.png",
      techStack: ["MongoDB", "Express.js", "React.js", "Node.js", "Tailwind CSS", "REST APIs", "Chart.js"],
      outcomes: [
        "Interactive pictorial charts for portfolio allocation (BTC, ETH, SOL, etc.)",
        "Real-time asset balance computation with live market price feeds",
        "Instant tracking of best performers and worst performers over 24h and 30d periods"
      ],
      links: {
        github: "https://github.com/rishifishyy"
      }
    }
  ],

  education: [
    {
      id: "edu-mca",
      degree: "Master of Computer Applications (MCA)",
      institution: "KIET Group of Institutions, Ghaziabad",
      duration: "Oct 2024 - July 2026",
      score: "CGPA: 7.43",
      icon: "🏛️",
      description: "Completed Master of Computer Applications, with focus in software systems, database engineering, computer algorithms, and modern application development."
    },
    {
      id: "edu-bca",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "I.T.S Mohan Nagar, Ghaziabad",
      duration: "Oct 2021 - July 2024",
      score: "First Division",
      icon: "🏛️",
      description: "Graduated with First Division, building strong foundational mastery in data structures, web technologies, and database management."
    }
  ]
};

// Export for module systems or attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
