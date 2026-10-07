export type ProjectStat = {
  value: string;
  label: string;
};

export type Project = {
  title: string;
  category: string;
  /** Who it was built with. Omitted for live personal demos. */
  context?: string;
  /** Material Symbols icon for cover cards on projects without a screenshot. */
  icon?: string;
  summary: string;
  description?: string;
  stats?: ProjectStat[];
  highlights?: string[];
  stack: string[];
  url?: string;
  image?: string;
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export const PROJECTS: Project[] = [
  {
    title: "EduJobs",
    category: "Hyperlocal Hiring Marketplace",
    context: "Sole Proprietorship · Solo Build",
    icon: "school",
    url: "https://edujobs.in",
    summary:
      "A hyperlocal marketplace that matches preschool educators with schools within 5 km, using PostGIS matching, privacy-first messaging and Gemini-powered deal summaries. Owned and run as a sole proprietorship.",
    description:
      "EduJobs replaces WhatsApp-group hiring with a verified placement pipeline. It covers spatial candidate matching, anonymous browsing until both sides consent, chat with contact details masked, SHA-256-locked commercial agreements, placement fees and a 30-day replacement guarantee.",
    stats: [
      { value: "1,559", label: "Automated tests" },
      { value: "20", label: "Tables under RLS" },
      { value: "403", label: "Commits, solo" },
    ],
    highlights: [
      "Every write goes through a transactional command pattern: the change, an immutable audit entry and queued emails commit in one PostgreSQL transaction.",
      "PostGIS radius filtering plus a hyperbolic distance-decay score keeps candidate rankings stable when recruiters widen the search radius.",
      "Gemini 2.5 Flash summarises hiring conversations using only contact-masked transcripts, and a structural test enforces that.",
      "Supabase hardened by revoking default public grants and enabling RLS on all 20 tables, verified with live catalog tests.",
      "1,559 Vitest and Playwright tests, including an end-to-end commercial lifecycle test against a PostGIS container in CI.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL 17",
      "PostGIS",
      "Drizzle ORM",
      "Supabase",
      "Gemini 2.5 Flash",
      "Resend",
      "Vitest",
      "Playwright",
      "Sentry",
    ],
  },
  {
    title: "ZapFee",
    category: "Fee & Accounting SaaS",
    context: "Solo Build",
    icon: "receipt_long",
    url: "https://zapfee.in",
    summary:
      "Multi-tenant fee collection and GST-compliant double-entry accounting for Indian education businesses, with Claude vision reading UPI payment screenshots.",
    description:
      "ZapFee brings admissions, fee quotations, instalment schedules, UPI and Razorpay payments, and statutory accounting into one place. Every rupee collected lands in an immutable, balanced ledger with the correct GST treatment for exempt schools and taxable coaching centres.",
    stats: [
      { value: "2,997", label: "Automated tests" },
      { value: "63", label: "Models under RLS" },
      { value: "738", label: "Commits, solo" },
    ],
    highlights: [
      "Claude Haiku 4.5 vision turns UPI payment screenshots into strict JSON. Downscaling in the browser cuts token use by about 75%, and staff approve each payment before it posts.",
      "Double-entry engine that enforces balanced journals, dedicated paisa-rounding accounts and locked accounting periods.",
      "GST matrix that chooses a Tax Invoice or Bill of Supply based on institute type, service and recipient.",
      "Razorpay webhooks verified with HMAC-SHA256 and idempotent receipt allocation, with gateway secrets encrypted using AES-256-GCM.",
      "Contract tests on statutory invoice documents and migration-aware column gating for zero-downtime deploys.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Prisma 7",
      "Supabase",
      "Claude Haiku 4.5",
      "Razorpay",
      "Tailwind CSS v4",
      "jsPDF",
      "GitHub Actions",
    ],
  },
  {
    title: "Vola",
    category: "AI Voice Agent Platform",
    context: "Team · Appiness Interactive",
    icon: "graphic_eq",
    url: "https://vola.appyverse.ai/",
    summary:
      "A multi-tenant platform where AI phone agents make human-like calls at scale, with live handoff to humans, GPT-4o-mini lead scoring and WhatsApp follow-ups.",
    description:
      "Businesses upload leads or connect a CRM, then configure a voice agent with its own knowledge base. Vola places outbound calls, handles objections, books appointments during the call and follows up on WhatsApp. The same codebase runs four products (Vola, Servy, Aiwy and Sloty), selected by subdomain.",
    stats: [
      { value: "4", label: "Products, one codebase" },
      { value: "0–10", label: "LLM lead scoring" },
      { value: "40+", label: "Postgres tables" },
    ],
    highlights: [
      "Voice-engine gateway over ElevenLabs Conversational AI and Fish Audio, with FreJun SIP transfers to human agents and recordings of both call legs.",
      "Sequential dialer that uses PostgreSQL optimistic locking to enforce per-client concurrency across serverless instances, with no Redis.",
      "After each call, GPT-4o-mini scores the lead and extracts follow-up tasks, then the platform meters credits, syncs the CRM and sends signed webhooks.",
      "Retry state machine with instant WhatsApp Business API fallbacks, plus a self-healing sweeper that reclaims stuck calls.",
      "The public call widget is protected by a proof-of-work challenge, Tor exit-node blocking, a honeypot field and rate limits.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "ElevenLabs",
      "Fish Audio",
      "GPT-4o-mini",
      "Vercel AI SDK",
      "WhatsApp Business API",
      "Twilio",
      "Calendly API",
      "Vitest",
    ],
  },
  {
    title: "Smart Physio",
    category: "Clinic Management SaaS",
    context: "Team · Appiness Interactive",
    icon: "physical_therapy",
    summary:
      "Multi-tenant practice management for physiotherapy clinics: conflict-free scheduling, SOAP notes, digital prescriptions and atomic point-of-sale billing.",
    description:
      "Smart Physio is the operating system for a physiotherapy practice. It handles patient registration, appointment booking without double-booking therapists, SOAP clinical notes, digital modality prescriptions, GST billing with partial payments, and print-ready PDF invoices.",
    stats: [
      { value: "4", label: "Role-based portals" },
      { value: "14-day", label: "Auto-booking lookahead" },
      { value: "30 min", label: "Collision-checked slots" },
    ],
    highlights: [
      "PostgreSQL enforces tenant isolation through RLS policies and a security-definer tenant resolver.",
      "Interval-overlap booking engine on 30-minute blocks, with a 14-day lookahead that auto-books first consultations.",
      "Atomic invoice settlement in a PL/pgSQL function that uses SELECT … FOR UPDATE row locks.",
      "My contribution: multi-therapist care teams with delta-based assignment alerts, plus a realtime notification centre with unread badges and history.",
      "Serverless PDF invoices and prescriptions built with @react-pdf/renderer and served from private storage through signed URLs.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "PL/pgSQL",
      "Supabase Realtime",
      "Tailwind CSS",
      "Recharts",
      "React PDF",
    ],
  },
  {
    title: "Saha",
    category: "Omnichannel AI Agent Platform",
    context: "Team · Appiness Interactive",
    icon: "smart_toy",
    summary:
      "A platform for building tool-calling AI agents and deploying them to websites and WhatsApp, with realtime live chat and human takeover.",
    description:
      "Teams configure agents with prompts, knowledge bases and tools, including REST APIs imported from cURL, Google Search and Calendly. They deploy them through an embeddable chat widget or WhatsApp, and operators can watch conversations live and take over from the AI at any moment.",
    stats: [
      { value: "2", label: "Channels, one AI engine" },
      { value: "5-step", label: "Tool-calling loop" },
      { value: "23", label: "Tables under RLS" },
    ],
    highlights: [
      "A single agent runtime serves SSE-streamed web chat and async WhatsApp webhooks, so tools and prompts stay identical across channels.",
      "User-defined API tools compile into Zod schemas at runtime, which lets agents chain tool calls through the Vercel AI SDK.",
      "Human takeover built on Supabase Realtime, with presence, typing indicators, read receipts and automatic hand-back to the AI after inactivity.",
      "A Cloudflare Worker WebSocket proxy keeps realtime chat working on sites with strict Content Security Policies.",
      "My contribution: the Saha global-agent workspace, live widget previews with 8 placement positions, and guards that catch unsaved changes.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Vercel AI SDK",
      "OpenAI",
      "Drizzle ORM",
      "Supabase Realtime",
      "Cloudflare Workers",
      "WhatsApp Business API",
      "Calendly OAuth",
    ],
  },
  {
    title: "Stonks",
    category: "Fintech Dashboard",
    context: "Solo Build",
    icon: "trending_up",
    url: "https://stonks-omega-red.vercel.app/",
    summary:
      "A real-time fintech dashboard featuring a RAG-powered AI assistant for smart mutual fund insights.",
    description:
      "Stonks combines live financial data tracking with a conversational RAG AI assistant. Users can analyze mutual funds, compare historical fund performances, and receive instant data-backed market insights powered by vector retrieval and LLMs.",
    stats: [
      { value: "RAG", label: "AI Retrieval" },
      { value: "Live", label: "Fund Analytics" },
      { value: "Instant", label: "AI Insights" },
    ],
    highlights: [
      "RAG architecture indexing mutual fund portfolios and market data to ground LLM responses in real facts.",
      "Interactive data visualizations tracking historical returns, NAV trends, and volatility metrics.",
      "Low-latency response pipeline coupling vector retrieval with fine-tuned conversational prompt templates.",
    ],
    stack: ["React", "Python", "RAG", "LLM Assistant", "FastAPI", "Vector DB"],
  },
  {
    title: "Music Maestro",
    category: "Generative AI App",
    context: "Solo Build",
    icon: "music_note",
    url: "https://music-maestro-lyart.vercel.app/",
    summary:
      "An AI-powered app that turns your mood or prompt into a Spotify playlist automatically.",
    description:
      "Music Maestro takes natural language descriptions of mood, activity, or vibe and converts them into carefully curated Spotify playlists. It communicates directly with the Spotify Web API to generate and save playlists to the user's account in seconds.",
    stats: [
      { value: "Mood AI", label: "Natural Language" },
      { value: "Spotify", label: "Web API OAuth" },
      { value: "Instant", label: "1-Click Sync" },
    ],
    highlights: [
      "LLM prompting pipeline to extract musical genres, energy levels, tempo, and valence from open-ended user text.",
      "OAuth 2.0 authorization code flow for secure, direct Spotify account access and playlist injection.",
      "Dynamic track matching and acoustic property filtering ensuring playlists match the requested vibe.",
    ],
    stack: ["Next.js", "TypeScript", "Generative AI", "Spotify Web API", "Tailwind CSS"],
  },
  {
    title: "MixNMatch",
    category: "Web Audio Beat Maker",
    context: "Solo Build",
    icon: "piano",
    url: "https://mix-n-match-ten.vercel.app/",
    summary:
      "An interactive, keyboard-controlled web drum machine and loop station powered by the Web Audio API.",
    description:
      "MixNMatch is an in-browser digital audio workstation and beat maker. Built directly on the native Web Audio API, it offers zero-latency sample playback, custom keyboard mappings, rhythmic loop stations, and responsive sound visualization.",
    stats: [
      { value: "Web Audio", label: "Low Latency API" },
      { value: "16", label: "Pads & Loops" },
      { value: "100%", label: "In-Browser Engine" },
    ],
    highlights: [
      "Native Web Audio API audio graph ensuring glitch-free, ultra-low-latency sample triggering across browsers.",
      "Custom keyboard and mouse event binding system allowing real-time multi-track drumming and looping.",
      "Hardware-accelerated visualizer synchronized to audio frequency and gain nodes.",
    ],
    stack: ["React", "Framer Motion", "Web Audio API", "Tailwind CSS"],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "AI & LLM Engineering",
    skills: [
      "LLM Orchestration",
      "AI Agents",
      "Tool Calling",
      "RAG",
      "Voice AI Agents",
      "Vision AI",
      "Structured Outputs",
      "Prompt Engineering",
      "Vercel AI SDK",
      "Hugging Face",
    ],
  },
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "PL/pgSQL", "Java", "HTML/CSS"],
  },
  {
    title: "Frameworks & Frontend",
    skills: [
      "Next.js 16",
      "React 19",
      "Node.js",
      "Tailwind CSS v4",
      "Radix UI / shadcn",
      "Express.js",
      "Framer Motion",
      "NumPy",
      "Pandas",
      "OpenCV",
    ],
  },
  {
    title: "Databases & Backend",
    skills: [
      "PostgreSQL",
      "PostGIS",
      "Supabase",
      "Drizzle ORM",
      "Prisma",
      "Row Level Security",
      "Server Actions",
      "Webhooks",
      "MySQL",
    ],
  },
  {
    title: "APIs & Integrations",
    skills: [
      "OpenAI",
      "Anthropic Claude",
      "Google Gemini",
      "ElevenLabs",
      "WhatsApp Business API",
      "Razorpay",
      "Calendly",
      "Twilio",
      "Resend",
      "Spotify API",
      "OAuth 2.0",
    ],
  },
  {
    title: "Testing, Cloud & DevOps",
    skills: [
      "Vitest",
      "Playwright",
      "GitHub Actions",
      "Vercel",
      "Cloudflare Workers",
      "Sentry",
      "Docker",
      "AWS",
      "Azure AI",
      "Git/GitHub",
      "Postman",
    ],
  },
];
