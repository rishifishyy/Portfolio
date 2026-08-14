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
      id: "project-1",
      title: "DevPulse - Developer Workspace",
      type: "Full Stack Web App",
      badge: "Featured",
      shortDescription: "All-in-one developer productivity hub with real-time markdown notes, task boards, and integrated code playground.",
      fullDescription: "Built a modern, responsive web application that streamlines daily developer workflows. Includes an interactive live code sandbox, synced markdown documentation, draggable Kanban boards, and persistent storage.",
      image: "assets/roomsketch-preview.svg",
      problemStatement: "Developers often bounce between multiple disconnected tools for code scratchpads, documentation, and task tracking, interrupting focus and workflow.",
      solution: "Created a unified dashboard bringing notes, code execution, and project tracking into one high-performance interface with offline support and lightning-fast load times.",
      techStack: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
      role: "Full Stack Developer",
      outcomes: [
        "Built responsive UI with keyboard navigation and dark theme first approach",
        "Implemented real-time local storage persistence and cloud sync API",
        "Achieved 95+ Lighthouse performance and accessibility scores"
      ],
      links: {
        live: "https://github.com/rishifishyy",
        github: "https://github.com/rishifishyy"
      }
    },
    {
      id: "project-2",
      title: "AlgoTrack - Coding Stats Tracker",
      type: "Analytics & API Integration",
      badge: "Trending",
      shortDescription: "Interactive coding statistics visualizer aggregating multi-platform problem solving metrics, contest ratings, and streaks.",
      fullDescription: "A personalized analytics dashboard that connects to competitive coding APIs and profiles (like Codolio, LeetCode, Codeforces) to generate real-time performance insights, topic heatmaps, and consistency trackers.",
      image: "assets/dexmatrix-preview.svg",
      problemStatement: "Tracking progress across separate coding platforms is tedious and lacks consolidated visual insight into algorithmic strengths and weaknesses.",
      solution: "Engineered a unified data pipeline that fetches profile statistics, computes skill distributions, and displays beautiful charts and radar metrics.",
      techStack: ["JavaScript", "React", "Chart.js", "Express.js", "REST APIs"],
      role: "Sole Creator",
      outcomes: [
        "Consolidated problem solving analytics into intuitive interactive visualizations",
        "Automated daily sync with rate-limiting and caching layer",
        "Integrated directly with Codolio profile metrics"
      ],
      links: {
        live: "https://codolio.com/profile/rishifishyy",
        github: "https://github.com/rishifishyy"
      }
    },
    {
      id: "project-3",
      title: "FlowState - Modern UI Component Kit",
      type: "Frontend Design System",
      badge: "Design System",
      shortDescription: "Lightweight, accessible UI component library crafted for sleek dark-mode dashboards and rapid prototyping.",
      fullDescription: "A comprehensive design system featuring 25+ accessible, composable UI components with subtle micro-animations, glassmorphism utilities, and zero external runtime dependencies.",
      image: "assets/agentflow-preview.svg",
      problemStatement: "Existing component libraries are often heavy, bloated, and require extensive customization to match a modern minimalist dark theme aesthetic.",
      solution: "Crafted modular, semantic components using modern CSS variables, container queries, and clean vanilla JavaScript primitives.",
      techStack: ["HTML5", "CSS3", "JavaScript", "Design Tokens", "Accessibility"],
      role: "Frontend Engineer & UI Designer",
      outcomes: [
        "Zero dependency footprint with sub-15KB bundle size",
        "Fully keyboard accessible and screen-reader compliant (ARIA)",
        "Includes dark mode presets and dynamic theme toggling"
      ],
      links: {
        live: "https://github.com/rishifishyy",
        github: "https://github.com/rishifishyy"
      }
    },
    {
      id: "project-4",
      title: "SmartVault - Secure Digital Storage",
      type: "Web Application",
      badge: "Security",
      shortDescription: "End-to-end client-side encrypted vault for sensitive notes, credentials, and configuration files.",
      fullDescription: "A secure web vault utilizing Web Crypto API for client-side AES-GCM encryption before storing data locally or syncing with a remote backend.",
      image: "assets/solwill-preview.svg",
      problemStatement: "Storing confidential development keys and personal notes on cloud services creates privacy concerns without zero-knowledge client encryption.",
      solution: "Developed a zero-knowledge web application where data is encrypted in the browser with user-derived keys before any persistence.",
      techStack: ["JavaScript", "Web Crypto API", "Node.js", "Tailwind CSS"],
      role: "Developer",
      outcomes: [
        "Zero-knowledge architecture with AES-256 client-side encryption",
        "Seamless offline mode with PWA service worker support",
        "Simple and clean intuitive user interface"
      ],
      links: {
        live: "https://github.com/rishifishyy",
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
