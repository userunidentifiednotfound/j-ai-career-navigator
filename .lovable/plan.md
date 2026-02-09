

# J-AI — AI-Powered Career Assistant (MVP)

## Overview
J-AI is a career readiness platform that guides users from role selection through personalized learning to job discovery. The MVP focuses on the core learning loop with AI-powered task generation, progress tracking, and an AI mentor chat.

---

## Phase 1: Foundation & Auth

### User Authentication
- Sign up / Login page with email & password
- User profile storage (selected role, time availability, progress data)
- Protected routes — all app features require login

### App Layout
- Clean sidebar navigation with dark/light mode toggle
- Mobile-responsive design
- Sidebar sections: Dashboard, My Tasks, Progress, Resume, Jobs, AI Mentor

---

## Phase 2: Role Selection & Onboarding

### Role Selection Flow
- Step 1: Choose **IT** or **Non-IT** category (visual cards)
- Step 2: Browse and select a specific role from 50+ IT roles and 15+ Non-IT roles, organized by subcategory (e.g., "Data & AI", "Cloud & DevOps")
- Step 3: Select daily time availability (30 min, 1 hr, 2 hrs, 3+ hrs)
- Save selections to user profile

---

## Phase 3: AI Task Generation Engine

### Daily Learning Tasks
- AI generates personalized daily tasks split into **Learn**, **Practice**, and **Revise** blocks
- Time allocation adapts to user's chosen availability
- Tasks are role-specific and progress sequentially (beginner → advanced)

### Free Platform Recommendations
- Each task links to **only free resources** (YouTube, freeCodeCamp, Coursera audit, LeetCode, HackerRank, Kaggle, etc.)
- Recommendations include platform name, reason, and difficulty match

---

## Phase 4: Progress Tracking Dashboard

### Dashboard
- Today's tasks with completion checkboxes
- Overall progress bar per skill area
- Weekly consistency streak tracker
- Resume readiness percentage
- Job readiness status indicator

### Progress Data
- Daily task completion tracking
- Skill completion percentages
- Learning streak counter
- Weak skill identification and AI suggestions

---

## Phase 5: ATS-Friendly Resume Builder

### Resume Editor
- Section-based editor: Summary, Skills, Projects, Experience, Education
- Role-specific keyword suggestions powered by AI
- Auto-generated bullet points based on completed skills and projects
- ATS-optimized formatting and layout

### Export
- PDF export (browser-based generation)
- DOCX export (via edge function)
- Customizable per job role

---

## Phase 6: Job & Internship Discovery

### AI-Powered Job Search
- Uses Perplexity API to search for current job openings and internships
- Results filtered by user's selected role and skill readiness
- Sources include LinkedIn, Indeed, Internshala, and company career pages
- Unlocks progressively as user completes learning milestones

---

## Phase 7: AI Mentor Chat

### Career Assistant Chatbot
- Conversational AI chat powered by Lovable AI (Gemini)
- Can answer career questions, recommend next skills, suggest resume improvements, and motivate consistency
- Maintains conversation history per session
- Streaming responses with markdown rendering

---

## Tech Stack
- **Frontend:** React + Tailwind + shadcn/ui
- **Backend:** Lovable Cloud (Supabase) — database, auth, edge functions
- **AI:** Lovable AI Gateway (Gemini) for task generation, resume suggestions, and mentor chat
- **Search:** Perplexity API for job/internship discovery
- **Export:** Browser PDF generation + edge function for DOCX

