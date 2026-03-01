const today = new Date().toISOString().split("T")[0];
const now = new Date().toISOString();

export const SKIP_AUTH_FOR_TESTING = true;

export const DEMO_USER = {
  email: "demo@jai.app",
  fullName: "Karthik Demo",
  roleCategory: "Software Development",
  selectedRole: "Frontend Developer",
  dailyTimeMinutes: 90,
};

export const DEMO_PROFILE = {
  id: "demo-profile",
  user_id: "demo-user",
  created_at: now,
  updated_at: now,
  full_name: DEMO_USER.fullName,
  role_category: DEMO_USER.roleCategory,
  selected_role: DEMO_USER.selectedRole,
  daily_time_minutes: DEMO_USER.dailyTimeMinutes,
  onboarding_completed: true,
};

export const DEMO_TASKS = [
  {
    id: "task-1",
    user_id: "demo-user",
    task_date: today,
    duration_minutes: 45,
    completed: true,
    created_at: now,
    task_type: "learn",
    title: "React Hooks Deep Dive",
    description: "Learn useMemo, useCallback, and custom hooks with practical examples.",
    platform_name: "YouTube",
    platform_url: "https://www.youtube.com/",
  },
  {
    id: "task-2",
    user_id: "demo-user",
    task_date: today,
    duration_minutes: 60,
    completed: true,
    created_at: now,
    task_type: "practice",
    title: "Build a Task Tracker UI",
    description: "Create responsive cards, filters, and completion toggles in React + Tailwind.",
    platform_name: "Frontend Mentor",
    platform_url: "https://www.frontendmentor.io/",
  },
  {
    id: "task-3",
    user_id: "demo-user",
    task_date: today,
    duration_minutes: 30,
    completed: false,
    created_at: now,
    task_type: "revise",
    title: "TypeScript Utility Types",
    description: "Revise Pick, Omit, Partial, and Record with interview-style snippets.",
    platform_name: "TypeScript Docs",
    platform_url: "https://www.typescriptlang.org/docs/",
  },
  {
    id: "task-4",
    user_id: "demo-user",
    task_date: today,
    duration_minutes: 50,
    completed: false,
    created_at: now,
    task_type: "practice",
    title: "Portfolio Hero Redesign",
    description: "Design and implement an image-first hero section with strong typography.",
    platform_name: "Dribbble",
    platform_url: "https://dribbble.com/",
  },
];

export const DEMO_PROGRESS = [
  {
    id: "prog-1",
    user_id: "demo-user",
    skill_name: "React Fundamentals",
    completion_percentage: 78,
    days_practiced: 18,
    current_streak: 6,
    longest_streak: 9,
    last_activity_date: today,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prog-2",
    user_id: "demo-user",
    skill_name: "TypeScript",
    completion_percentage: 65,
    days_practiced: 14,
    current_streak: 4,
    longest_streak: 7,
    last_activity_date: today,
    created_at: now,
    updated_at: now,
  },
  {
    id: "prog-3",
    user_id: "demo-user",
    skill_name: "System Design Basics",
    completion_percentage: 42,
    days_practiced: 10,
    current_streak: 3,
    longest_streak: 5,
    last_activity_date: today,
    created_at: now,
    updated_at: now,
  },
];

export const DEMO_JOBS = [
  {
    title: "Junior Frontend Developer",
    company: "PixelForge Labs",
    location: "Remote",
    type: "Full-time",
    experience: "0-2 years",
    skills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    platform: "LinkedIn",
    url: "https://www.linkedin.com/jobs/",
    description: "Build user-facing features with React and collaborate with design and product teams.",
  },
  {
    title: "UI Engineer Intern",
    company: "Nimbus Studio",
    location: "Bengaluru",
    type: "Internship",
    experience: "Freshers",
    skills: ["HTML", "CSS", "JavaScript", "Figma"],
    platform: "Wellfound",
    url: "https://wellfound.com/jobs",
    description: "Support UI implementation and improve performance for modern web applications.",
  },
  {
    title: "Frontend Developer",
    company: "ScaleCart",
    location: "Hyderabad",
    type: "Remote",
    experience: "1-3 years",
    skills: ["Next.js", "TypeScript", "REST APIs", "Testing"],
    platform: "Indeed",
    url: "https://in.indeed.com/",
    description: "Own dashboard modules, integrate APIs, and optimize UX for e-commerce operations.",
  },
];

export const DEMO_RESUME = {
  personalInfo: {
    name: "Karthik S",
    email: "karthik.demo@gmail.com",
    phone: "+91 90000 11111",
    location: "Chennai, India",
  },
  education: "B.E. Computer Science, ABC Institute of Technology (2019-2023)",
  skills: "React, TypeScript, Tailwind CSS, Node.js, PostgreSQL, Git, REST APIs",
  experience: [
    {
      company: "ByteNest",
      role: "Frontend Developer Intern",
      duration: "Jan 2023 - Jul 2023",
      description: "Built reusable dashboard components and improved Lighthouse score by 24%.",
    },
    {
      company: "Freelance",
      role: "Web Developer",
      duration: "Aug 2023 - Present",
      description: "Delivered 8 responsive websites for small businesses with SEO-ready pages.",
    },
  ],
  resumeData: {
    summary:
      "Frontend Developer with practical experience in building performant, responsive web applications using React and TypeScript. Strong focus on clean UI, component reusability, and business-oriented outcomes.",
    experienceBullets: [
      {
        company: "ByteNest",
        role: "Frontend Developer Intern",
        duration: "Jan 2023 - Jul 2023",
        bullets: [
          "Developed 20+ reusable UI components, reducing implementation time across pages by 30%.",
          "Improved mobile page load speed by 24% through bundle and image optimizations.",
          "Collaborated with product and design teams to launch 3 user-facing modules on time.",
        ],
      },
      {
        company: "Freelance",
        role: "Web Developer",
        duration: "Aug 2023 - Present",
        bullets: [
          "Built and deployed 8 responsive business websites with clear conversion-focused layouts.",
          "Integrated SEO metadata and semantic structure, improving discoverability for client pages.",
          "Delivered projects end-to-end, from wireframe to production support.",
        ],
      },
    ],
    skillCategories: [
      { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
      { category: "Backend", skills: ["Node.js", "Express", "PostgreSQL"] },
      { category: "Tools", skills: ["Git", "GitHub", "Figma", "Postman"] },
    ],
    keywords: ["React", "TypeScript", "Responsive Design", "Component Architecture", "Performance"],
    tips: [
      "Keep each bullet point achievement-focused with measurable impact.",
      "Mirror role-specific keywords from job descriptions in your summary and skills.",
      "Use concise action verbs and keep formatting consistent across sections.",
    ],
  },
};
