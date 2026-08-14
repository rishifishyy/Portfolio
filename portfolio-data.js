/**
 * Portfolio Data Configuration for Rishi Nehra
 * Edit this file to customize your portfolio details, experiences, projects, and links.
 */
const portfolioData = {
  profile: {
    name: "Rishi Nehra",
    tagline: "Full Stack Developer | Software Engineer | Problem Solver",
    statusBadge: "Open to Work",
    statusAvailable: true,
    avatarUrl: "assets/avatar.png",
    summary: `I'm a passionate Full-Stack Developer focused on building clean, high-performance web applications and scalable software systems.

I love tackling complex algorithmic challenges, designing intuitive frontend interfaces, and engineering reliable backend services. Always curious and actively learning new technologies.`,
    contact: {
      email: "mailto:rishinehra@example.com",
      github: "https://github.com/rishifishyy",
      linkedin: "https://www.linkedin.com/in/rishi-nehra-78274a1a0/",
      codolio: "https://codolio.com/profile/rishifishyy"
    },
    skills: [
      "React.js",
      "Next.js",
      "JavaScript (ES6+)",
      "Node.js",
      "Express.js",
      "C++ / Data Structures",
      "SQL",
      "MongoDB",
      "Tailwind CSS",
      "Git & GitHub",
      "REST APIs"
    ]
  },

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
      id: "ai-exam-notes",
      title: "AI Exam Notes",
      type: "AI & Full Stack Web App",
      badge: "Open Source",
      shortDescription: "An AI-powered study companion that helps students generate concise exam notes, high-yield summaries, and quick-revision flashcards.",
      fullDescription: "AI Exam Notes is an intelligent web application designed to accelerate exam preparation. It takes lecture notes, textbook passages, or topic outlines and uses AI to distill them into crisp summaries, formula cheat sheets, and predicted high-probability exam questions.",
      image: "assets/aiexamnotes-preview.svg",
      problemStatement: "Students spend hours sifting through lengthy textbook chapters and disjointed lecture slides trying to figure out what actually matters for upcoming exams.",
      solution: "Engineered an intuitive AI tool that automatically extracts key concepts, organizes high-yield bullet points, and generates structured revision cards in seconds.",
      techStack: ["React.js", "Node.js", "Express.js", "JavaScript", "Tailwind CSS", "REST APIs", "AI Integration"],
      role: "Creator & Full Stack Developer",
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
      id: "crypto-tracker",
      title: "Crypto Portfolio Tracker",
      type: "FinTech / MERN Stack",
      badge: "Currently Working",
      isComingSoon: true,
      shortDescription: "A comprehensive crypto portfolio tracker with real-time pictorial charts, balance breakdown, and automated best vs worst performer analytics.",
      fullDescription: "Currently developing a full-featured cryptocurrency portfolio tracking dashboard built on the MERN stack. It connects to live crypto market feeds to give users visual representations of their asset allocation, 30-day profit/loss trends, and spotlight alerts for top gainers and biggest losers in their portfolio.",
      image: "assets/crypto-tracker.png",
      problemStatement: "Crypto investors holding assets across multiple wallets and exchanges lack a single visual dashboard to see their total balance, asset distribution percentage, and historical ROI performance at a glance.",
      solution: "Building a responsive MERN application with dynamic donut charts for asset allocation, smooth area graphs for portfolio growth, and automated categorization of best vs worst performing tokens.",
      techStack: ["MongoDB", "Express.js", "React.js", "Node.js", "Tailwind CSS", "REST APIs", "Chart.js"],
      role: "Lead Developer (In Active Development)",
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

  achievements: [
    {
      id: "a1",
      year: "2024",
      title: "Codolio Profile & Problem Solving Milestones",
      context: "Actively solving competitive programming problems and tracking progress across data structures & algorithms on Codolio.",
      link: "https://codolio.com/profile/rishifishyy"
    },
    {
      id: "a2",
      year: "2024",
      title: "Open Source Contributions & Projects",
      context: "Building and sharing open-source developer tools, repositories, and modern web application templates on GitHub.",
      link: "https://github.com/rishifishyy"
    },
    {
      id: "a3",
      year: "2024",
      title: "Continuous Learning & Software Engineering",
      context: "Deepening expertise in full-stack architecture, modern frontend frameworks, and backend system design.",
      link: null
    }
  ]
};

// Export for module systems or attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
