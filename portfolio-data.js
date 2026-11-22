window.PORTFOLIO_SNAKE_API = "https://rishifishyy-portfolio-activity.netlify.app/api/snake-best";
window.PORTFOLIO_ACTIVITY_API = "https://rishifishyy-portfolio-activity.netlify.app/api/coding-activity";

const portfolioData = {
  profile: {
    name: "Rishi Nehra",
    tagline: "Full-stack developer working with React, Node.js, and MongoDB.",
    statusBadge: "Open to work",
    statusAvailable: true,
    avatarUrl: "assets/avatar.png",
    summary: "I enjoy building interactive interfaces and solving algorithm problems. I'm learning Python for automation and using language models in small web projects.",
    contact: {
      email: "rishinehra1@gmail.com",
      mailUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=rishinehra1@gmail.com",
      github: "https://github.com/rishifishyy",
      linkedin: "https://www.linkedin.com/in/rishi-nehra-78274a1a0/",
      codolio: "https://codolio.com/profile/rishifishyy",
      leetcode: "https://leetcode.com/u/rishifishyy/",
      gfg: "https://www.geeksforgeeks.org/profile/rishifishyy?tab=activity",
      resume: "https://drive.google.com/file/d/1p3IZfBcOl1MRIOEcIVmqdzuHK5Eb-CU1/view?usp=sharing"
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
      duration: "Awaiting onboarding",
      summary: "Preparing for enterprise software development and systems design.",
      technologies: ["System Engineering", "C++", "SQL", "Software Development", "Problem Solving"],
      logoUrl: "assets/tcs.png",
      logoText: "TCS",
      logoColor: "#000000"
    },
    {
      id: "exp-oasis",
      company: "Oasis Infobyte",
      role: "Web Development Intern",
      duration: "Jun 2025 – Jul 2025",
      summary: "Built responsive interfaces and integrated APIs on projects using React, Node.js, Express, and MongoDB.",
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
      type: "Full-stack web app",
      featured: true,
      badge: "Live App",
      shortDescription: "Find Fortnite teammates across eight server regions, with live invites and in-app chat.",
      fullDescription: "TeamUP matches Fortnite players across eight server regions. Players can filter by game mode, build preference, platform, mic, and language, then send invites and chat after matching.",
      image: "assets/teamup-home.png",
      imageSrcset: "assets/teamup-home-small.png 954w, assets/teamup-home.png 1908w",
      imageAlt: "TeamUP homepage with the Good games, Great teammates headline and squad matching radar",
      previewAspect: "wide",
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "Framer Motion", "Tailwind CSS", "REST APIs", "Render"],
      outcomes: [
        "Live matchmaking pool with filters by region and play style",
        "Player invites and match notifications",
        "Real-time chat for matched players"
      ],
      links: {
        live: "https://teamup-x5fq.onrender.com/",
        github: "https://github.com/rishifishyy/teamUP"
      }
    },
    {
      id: "ai-exam-notes",
      title: "AI Exam Notes",
      type: "Study tool",
      badge: "Open Source",
      shortDescription: "Turn course material into exam notes, summaries, and flashcards.",
      fullDescription: "Paste lecture notes, textbook passages, or topic outlines to generate study summaries, formula sheets, and practice questions.",
      image: "assets/aiexamnotes-preview.svg",
      techStack: ["React.js", "Node.js", "Express.js", "JavaScript", "Tailwind CSS", "REST APIs", "AI Integration"],
      outcomes: [
        "AI-generated notes and summaries from course material",
        "Copy and export options"
      ],
      links: {
        github: "https://github.com/rishifishyy/aiexamnotes"
      }
    },
    {
      id: "digital-chalisa",
      title: "Digital Chalisa",
      type: "Audio player",
      badge: "Live App",
      shortDescription: "Listen to six Chalisas with synchronized Hindi and Romanized lyrics.",
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
      type: "Portfolio dashboard",
      badge: "Currently Working",
      isComingSoon: true,
      shortDescription: "Track crypto balances, asset allocation, and price performance.",
      fullDescription: "A dashboard in development that uses live market feeds to show asset allocation, 30-day profit and loss, and the strongest and weakest performers in a portfolio.",
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
      duration: "Oct 2024 – Jul 2026",
      score: "CGPA: 7.43",
      icon: "🏛️",
      description: "Completed Master of Computer Applications, with focus in software systems, database engineering, computer algorithms, and modern application development."
    },
    {
      id: "edu-bca",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "I.T.S Mohan Nagar, Ghaziabad",
      duration: "Oct 2021 – Jul 2024",
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
