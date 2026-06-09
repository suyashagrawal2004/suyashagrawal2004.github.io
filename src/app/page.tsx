"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════
   CONSTANTS — Exact Stitch hex codes
   ═══════════════════════════════════════════════════ */
const THEMES = ["default", "lavender", "catppuccin"] as const;
type Theme = (typeof THEMES)[number];

const ACCENT_HEX: Record<Theme, string> = {
  default: "#f3ffca",
  lavender: "#3b0764",
  catppuccin: "#8b5523",
};

const GEAR_IMG = "/assets/gear.png";
const CURSOR_IMG = "/assets/cursor.png";
const HERO_IMG = "/assets/suyash_photo.jpg";
const PROJECT_IMGS = [
  "/assets/project-music-maestro.png",
  "/assets/project-mix-n-match.png",
  "/assets/project-stonks.png",
];

/* ═══════════════════════════════════════════════════
   TypingText — Exact Stitch: 80ms/char, threshold 0.2
   ═══════════════════════════════════════════════════ */
function TypingText({
  text,
  className,
  speed = 80,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [display, setDisplay] = useState("");
  const typed = useRef(false);

  useEffect(() => {
    if (isInView && !typed.current) {
      typed.current = true;
      let i = 0;
      const iv = setInterval(() => {
        if (i < text.length) {
          setDisplay(text.slice(0, i + 1));
          i++;
        } else clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }
  }, [isInView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function MultiTypingText({
  texts,
  className,
  speed = 80,
  delay = 2000,
}: {
  texts: readonly string[];
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), delay);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      const timeout = setTimeout(() => {
        setReverse(false);
        setIndex((prev) => (prev + 1) % texts.length);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, speed, delay]);

  return (
    <span className={className}>
      {texts[index].substring(0, subIndex)}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Reveal wrapper — Exact Stitch: 0.8s ease-out, Y:30,
   threshold 0.1
   ═══════════════════════════════════════════════════ */
function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0, 0, 0.58, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   R3F Scene — Theme-reactive wireframe icosahedron
   ═══════════════════════════════════════════════════ */
function SceneContent({ accentColor }: { accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useRef(new THREE.Color(accentColor));

  useEffect(() => {
    color.current.set(accentColor);
  }, [accentColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.color.lerp(color.current, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial wireframe color={accentColor} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECT MODAL — Exact Stitch structure
   ═══════════════════════════════════════════════════ */
function ProjectModal({
  title,
  desc,
  url,
  onClose,
}: {
  title: string;
  desc: string;
  url?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <div className="bg-[var(--surface-variant)] border border-[var(--border-color)] w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl md:text-3xl font-headline font-bold text-themed">
                {title}
              </h3>
              <div className="flex gap-4">
                {url && (
                  <a 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link px-4 md:px-6 py-2 bg-[var(--border-color)] text-[var(--text)] text-[10px] md:text-xs font-bold uppercase rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    Open In New Tab{" "}
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                  </a>
                )}
                <button
                  className="nav-link w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
              {desc}
            </p>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 md:p-6">
              <div className="w-full h-full bg-black/40 rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-inner">
                {url ? (
                  <iframe 
                    src={url}
                    className="w-[133.33%] h-[133.33%] border-0 origin-top-left scale-[0.75]"
                    title={title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] italic">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-6xl mb-4 block">
                        terminal
                      </span>
                      <p>Interactive Emulator Placeholder</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function Page() {
  /* ── Theme ── */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved && THEMES.includes(saved as Theme)) {
        return saved as Theme;
      }
    }
    return "default";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setSpecificTheme = useCallback((next: Theme) => {
    setTheme(next);
  }, []);

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["about", "skills", "experience", "projects"];
    
    const handleScroll = () => {
      // Use a detection line roughly 1/3 down the viewport
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Modal ── */
  const [modal, setModal] = useState<{
    title: string;
    desc: string;
    url?: string;
  } | null>(null);

  /* ── Refs for imperative scroll logic (exact Stitch JS) ── */
  const progressBarRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<SVGSVGElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLElement>(null);
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  /* ── Scroll handler: EXACT reproduction of Stitch JS ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const globalPercent = Math.min(Math.max(scrolled / totalHeight, 0), 1);

      /* Top progress bar width - bounded to prevent gear overflow */
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `calc(${globalPercent * 100}% - 36px)`;
      }

      /* Gear rotation: scrolled * 2.5 degrees */
      if (gearRef.current) {
        gearRef.current.style.transform = `rotate(${scrolled * 2.5}deg)`;
      }

      /* Timeline progress + active nodes */
      const tc = timelineContainerRef.current;
      const tp = timelineProgressRef.current;
      if (tc && tp) {
        const rect = tc.getBoundingClientRect();
        const vc = window.innerHeight / 2;
        if (rect.top < vc) {
          const progress = Math.min(Math.max(vc - rect.top, 0), rect.height);
          tp.style.height = progress + "px";
          const nodes = tc.querySelectorAll(".milestone-node");
          const rows = tc.querySelectorAll(".timeline-row");
          rows.forEach((row, idx) => {
            const rr = row.getBoundingClientRect();
            const rc = rr.top + rr.height / 2;
            if (rc < vc + 50 && rc > vc - 250) {
              nodes[idx]?.classList.add("active");
              nodes[idx]?.classList.remove("passed");
              row.classList.add("active");
            } else if (rc <= vc - 250) {
              nodes[idx]?.classList.remove("active");
              nodes[idx]?.classList.add("passed");
              row.classList.remove("active");
            } else {
              nodes[idx]?.classList.remove("active");
              nodes[idx]?.classList.remove("passed");
              row.classList.remove("active");
            }
          });
        }
      }

      /* Horizontal project scroll (exact Stitch formula) */
      const hs = horizontalSectionRef.current;
      const pt = projectTrackRef.current;
      if (hs && pt) {
        const hr = hs.getBoundingClientRect();
        if (hr.top <= 0 && hr.bottom >= window.innerHeight) {
          const percent = -hr.top / (hr.height - window.innerHeight);
          const total =
            pt.scrollWidth - window.innerWidth + window.innerWidth * 0.2;
          pt.style.transform = `translateX(-${percent * total}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Custom cursor (exact Stitch) ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent | PointerEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const hover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const t = target.closest(
        ".nav-link, a, button, .project-card, .theme-pill"
      );
      if (t) cursor.classList.add("hovering");
      else cursor.classList.remove("hovering");

      // Grab state only if NOT hovering a clickable element
      if (target.closest("#cert-container, #floating-action-bar") && !t) {
        cursor.classList.add("can-grab");
      } else {
        cursor.classList.remove("can-grab");
      }
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("mouseover", hover);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", hover);
    };
  }, []);

  /* ── Netflix-style Scroll for Cert Container ── */
  const [certScroll, setCertScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const container = document.getElementById("cert-container");
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCertScroll({
        left: scrollLeft > 10,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    };

    container.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check

    return () => container.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollCerts = useCallback((direction: "left" | "right") => {
    const container = document.getElementById("cert-container");
    if (!container) return;
    const cardWidth = 320; // w-80 is 20rem = 320px
    const gap = 32; // gap-8 is 2rem = 32px
    const scrollAmount = cardWidth + gap;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  }, []);

  /* ═══════════════ JSX ═══════════════ */
  return (
    <>
      {/* ── Custom Cursor ── */}
      <div id="custom-cursor" ref={cursorRef}>
        <div id="cursor-img" />
        <div id="cursor-dot-inner" />
      </div>

      {/* ── Top Progress Bar ── */}
      <div id="top-progress-container">
        <div id="top-progress-bar" ref={progressBarRef}>
          <div id="scroll-gear-container">
            <svg ref={gearRef} id="scroll-gear-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          HEADER — Exact Stitch:
          px-8 md:px-16 py-6, glass bg, blur-lg
          ════════════════════════════════════ */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-6 glass-header border-b border-[var(--border-color)]">
        <div 
          className="text-lg font-headline font-bold tracking-tighter text-[var(--text)] uppercase hover-accent transition-colors cursor-pointer nav-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Suyash.
        </div>
        <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] items-center">
          <a
            className={`nav-link hover:text-[var(--primary)] transition-all duration-300 ${
              activeSection === "skills" 
                ? "text-[var(--primary)] font-extrabold scale-110" 
                : "text-[var(--text-muted)] opacity-50 font-medium"
            }`}
            href="#skills"
          >
            Skills
          </a>
          <a
            className={`nav-link hover:text-[var(--primary)] transition-all duration-300 ${
              activeSection === "experience" 
                ? "text-[var(--primary)] font-extrabold scale-110" 
                : "text-[var(--text-muted)] opacity-50 font-medium"
            }`}
            href="#experience"
          >
            Experience
          </a>
          <a
            className={`nav-link hover:text-[var(--primary)] transition-all duration-300 ${
              activeSection === "projects" 
                ? "text-[var(--primary)] font-extrabold scale-110" 
                : "text-[var(--text-muted)] opacity-50 font-medium"
            }`}
            href="#projects"
          >
            Projects
          </a>
        </nav>
        {/* Theme Pill — 3 direct click dots */}
        <div className="flex items-center gap-6">
          <div className="theme-pill">
            <div
              className={`theme-dot theme-dot-1 nav-link cursor-pointer ${theme === "default" ? "opacity-100 shadow-[0_0_8px_var(--primary)]" : "opacity-30 hover:opacity-70 transition-opacity"}`}
              onClick={() => setSpecificTheme("default")}
            />
            <div
              className={`theme-dot theme-dot-2 nav-link cursor-pointer ${theme === "lavender" ? "opacity-100 shadow-[0_0_8px_var(--primary)]" : "opacity-30 hover:opacity-70 transition-opacity"}`}
              onClick={() => setSpecificTheme("lavender")}
            />
            <div
              className={`theme-dot theme-dot-3 nav-link cursor-pointer ${theme === "catppuccin" ? "opacity-100 shadow-[0_0_8px_var(--primary)]" : "opacity-30 hover:opacity-70 transition-opacity"}`}
              onClick={() => setSpecificTheme("catppuccin")}
            />
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════ */}
      <main>
        {/* ── HERO ── min-h-screen, pt-20=80px, px-8=32px */}
        <section
          className="min-h-screen flex items-center justify-center pt-28 pb-20 lg:pt-20 lg:pb-0 px-8"
          id="about"
        >
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Reveal className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--surface-variant)] border border-accent-20 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-[pulse_1s_infinite] shadow-[0_0_10px_var(--primary)]" />
                <span className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)]">
                  Open to Immediate Relocation | India & Worldwide
                </span>
              </Reveal>

              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-primary-neon leading-none mb-4 hover-green transition-colors">
                <TypingText text="SUYASH AGRAWAL" />
                <span className="typing-cursor" />
              </h1>
              
              <Reveal className="mb-8 h-[24px]">
                <span className="text-sm md:text-base font-bold tracking-[0.5em] text-[var(--text-muted)] uppercase flex items-center">
                  <MultiTypingText texts={["AI Engineer","AI Product Manager", "Generative AI Specialist", "Workflow Automation"] as const} />
                  <span className="typing-cursor h-4 ml-1" />
                </span>
              </Reveal>

              <Reveal>
                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-xl leading-relaxed">
                  Building resilient{" "}
                  <span className="text-[var(--text)] font-medium">LLM systems</span>{" "}
                  and{" "}
                  <span className="text-[var(--text)] font-medium">
                    Autonomous Agents
                  </span>
                  . Currently architecting intelligent workflows for
                  international scale.
                </p>
              </Reveal>

              {/* Buttons: px-8=32px py-4=16px text-xs=12px gap-6=24px mt-12=48px rounded-lg=8px */}
              <Reveal className="flex gap-6 mt-12">
                <a 
                  href="https://drive.google.com/file/d/15tSOsbyGEU08uyMGDqE_t1H5-lu2S_wt/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link px-8 py-4 bg-[var(--primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_var(--primary)] transition-all inline-block"
                >
                View Resume
                </a>
              </Reveal>
            </div>

            {/* Hero image/3D: max-w-md=448px aspect-[3/4] rounded-[2.5rem]=40px */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <Reveal className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden hero-img-float hero-img-container">
                {/* Image — initial grayscale via CSS */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMG}
                  alt="Suyash Agrawal"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent pointer-events-none z-20" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SKILLS ── py-32=128px px-8=32px bg-[var(--surface-dark)] */}
        <section
          className="py-32 px-8 border-t border-[var(--border-color)] bg-surface-dark"
          id="skills"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline text-3xl md:text-6xl font-bold text-primary-neon mb-20 hover-green transition-colors">
              <TypingText text="TECHNICAL SKILLS" />
              <span className="typing-cursor" />
            </h2>

            {/* Grid: p-10=40px, border-[var(--border-color)], text-sm=14px, text-xs=12px, space-y-2=8px */}
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI & Automation */}
                <div className="p-8 bg-white/[0.02] border border-[var(--border-color)] rounded-[20px] transition-colors hover:border-[var(--border-color)]">
                  <h3 className="text-[13px] font-bold text-accent tracking-[0.15em] mb-6 uppercase">
                    AI &amp; Automation
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">LLM Orchestration</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">AI Agents</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Generative AI</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Prompt Engineering</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Vercel AI SDK</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Hugging Face</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="p-8 bg-white/[0.02] border border-[var(--border-color)] rounded-[20px] transition-colors hover:border-[var(--border-color)]">
                  <h3 className="text-[13px] font-bold text-accent tracking-[0.15em] mb-6 uppercase">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">TypeScript</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">JavaScript</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Python</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Java</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">SQL</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">HTML/CSS</span>
                  </div>
                </div>

                {/* Frameworks */}
                <div className="p-8 bg-white/[0.02] border border-[var(--border-color)] rounded-[20px] transition-colors hover:border-[var(--border-color)]">
                  <h3 className="text-[13px] font-bold text-accent tracking-[0.15em] mb-6 uppercase">
                    Frameworks
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Next.js</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Node.js</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">React</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Express.js</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">NumPy</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Pandas</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">OpenCV</span>
                  </div>
                </div>

                {/* APIs & Services */}
                <div className="p-8 bg-white/[0.02] border border-[var(--border-color)] rounded-[20px] transition-colors hover:border-[var(--border-color)]">
                  <h3 className="text-[13px] font-bold text-accent tracking-[0.15em] mb-6 uppercase">
                    APIs &amp; Services
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">OpenAI</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Anthropic</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">ElevenLabs</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Spotify API</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">WABA API</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">OAuth 2.0</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">REST APIs</span>
                  </div>
                </div>

                {/* Tools & Cloud */}
                <div className="p-8 bg-white/[0.02] border border-[var(--border-color)] rounded-[20px] transition-colors hover:border-[var(--border-color)]">
                  <h3 className="text-[13px] font-bold text-accent tracking-[0.15em] mb-6 uppercase">
                    Tools &amp; Cloud
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Git/GitHub</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Vercel</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Render</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">MySQL</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Postman</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">VS Code</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">Azure AI</span>
                    <span className="px-4 py-2 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-muted)]">AWS</span>
                  </div>
                </div>

                <a
                  className="nav-link relative block overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-8 py-7 transition-colors hover:border-accent-40 md:col-span-2 lg:col-span-1"
                  href="/assets/Blood_Donation_Camp_Appreciation_Letter.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-[var(--primary)]" />
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
                  <div className="relative pl-2">
                    <div className="text-[10px] font-bold text-accent tracking-[0.24em] uppercase mb-3">
                      Leadership &amp; Social Impact
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text)] mb-2">
                      Organised Blood Donation Camp
                    </h3>
                    <div className="text-xs font-bold tracking-[0.16em] text-[var(--text-muted)] uppercase mb-4">
                      Indian Red Cross Society
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] mb-4">
                      <span>Vijayawada, AP</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                      <span>Nov 2025</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      Led a community blood donation drive in collaboration with the Indian Red Cross Society as part of a student-led social impact effort.
                    </p>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── EXPERIENCE & EDUCATION ── py-32=128px, timeline with cubic-bezier */}
        <section
          className="py-32 px-8 bg-surface overflow-hidden"
          id="experience"
        >
          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-center mb-32">
              <Reveal className="w-full text-center">
                <h2 className="font-headline text-3xl md:text-6xl font-bold text-primary-neon uppercase">
                  <TypingText text="EXPERIENCE & EDUCATION" />
                  <span className="typing-cursor" />
                </h2>
              </Reveal>
            </div>

            {/* Timeline container — min-h-[1200px] */}
            <div
              className="relative min-h-[1200px] w-full"
              id="timeline-container"
              ref={timelineContainerRef}
            >
              <div className="timeline-line">
                <div id="timeline-progress" ref={timelineProgressRef} />
              </div>

              {/* Item 1: Experience — gap-24=96px mb-48=192px pr-16=64px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group w-full">
                <Reveal className="pl-[60px] md:pl-0 md:pr-16 md:text-right">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    JAN 2026 - PRESENT
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text)] mb-2 hover-green transition-colors">
                    AI Engineer Intern
                  </h4>
                  <div className="mb-4">
                    <p className="text-[var(--text-muted)] font-medium">
                      Appiness Interactive Private Limited
                    </p>
                    <p className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mt-1">
                      Bengaluru, KA, India
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md md:ml-auto">
                    Developing enterprise-grade agentic workflows and LLM
                    orchestration layers. Focused on improving retrieval accuracy{" "}
                    <br className="hidden md:block" />
                    and multi-step reasoning capabilities.
                  </p>
                </Reveal>
                {/* Node: w-4=16px h-4=16px border-2 */}
                <div className="milestone-node" />
                <div className="hidden md:block" />
              </div>

              {/* Item 2: B.Tech — p-6=24px rounded-2xl=16px text-xl=20px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group w-full">
                <div className="hidden md:block" />
                <div className="milestone-node" />
                <Reveal className="pl-[60px] md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2022 - 2026
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text)] mb-2 hover-green transition-colors">
                    B.Tech in Computer Science Engineering (Core)
                  </h4>
                  <div className="mb-6">
                    <p className="text-[var(--text-muted)] font-medium">
                      VIT-AP University
                    </p>
                    <p className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mt-1">
                      Amaravati, AP, India
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--border-color)] rounded-2xl border border-[var(--border-color)] inline-block">
                    <span className="text-accent font-bold">
                      8.5 / 10.0
                    </span>{" "}
                    <span className="text-[var(--text-muted)] ml-2">CGPA</span>
                  </div>
                </Reveal>
              </div>

              {/* Item 3: Higher Secondary — p-4=16px rounded-xl=12px */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center mb-48 timeline-row group w-full">
                <div className="hidden md:block" />
                <div className="milestone-node" />
                <Reveal className="pl-[60px] md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2020 - 2022
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text)] mb-2 hover-green transition-colors">
                    Higher Secondary - 12th (CBSE)
                  </h4>
                  <div className="mb-4">
                    <p className="text-[var(--text-muted)] font-medium">
                      Deens Academy
                    </p>
                    <p className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mt-1">
                      Bengaluru, KA, India
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mb-6">
                    <strong className="text-[var(--text)] font-semibold">Science Stream (PCMC):</strong> Physics, Chemistry, Mathematics, with Computer Science.
                  </p>
                  <div className="p-4 bg-[var(--border-color)] rounded-xl border border-[var(--border-color)] inline-flex items-center gap-4">
                    <span className="text-accent font-bold">92.8%</span>
                    <div className="h-4 w-px bg-[var(--border-color)]" />
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                      Graduated with Distinction
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* Item 4: Secondary */}
              <div className="relative grid md:grid-cols-2 gap-24 items-center timeline-row group w-full">
                <div className="hidden md:block" />
                <div className="milestone-node" />
                <Reveal className="pl-[60px] md:pl-16">
                  <div className="text-xs font-bold text-accent tracking-[0.3em] mb-4">
                    2008 - 2020
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text)] mb-2 hover-green transition-colors">
                    Secondary - 10th (CBSE)
                  </h4>
                  <div className="mb-4">
                    <p className="text-[var(--text-muted)] font-medium">
                      Deens Academy
                    </p>
                    <p className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mt-1">
                      Bengaluru, KA, India
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mb-6">
                    <strong className="text-[var(--text)] font-semibold">General Subjects:</strong> Mathematics, Science, Social Science, Hindi, and English.
                  </p>
                  <a
                    className="nav-link group p-4 bg-[var(--border-color)] rounded-xl border border-[var(--border-color)] inline-flex items-center gap-4 hover:border-accent-40 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(243,255,202,0.14)] transition-all"
                    href="/assets/Suyash_Agrawal_Grade_10_Certificate_Of_Merit.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-accent font-bold">94.4%</span>
                    <div className="h-4 w-px bg-[var(--border-color)]" />
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                      Academic Excellence
                    </span>
                    <span className="material-symbols-outlined text-sm text-accent opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100">
                      north_east
                    </span>
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── horizontal-scroll-container: 350vh, mt: 10vh */}
        <section
          className="horizontal-scroll-container"
          id="projects"
          ref={horizontalSectionRef}
        >
          <div className="sticky-wrapper">
            {/* Title overlay */}
            <div className="absolute top-20 left-0 w-full px-8 md:px-16 z-20">
              <h2 className="font-headline text-3xl md:text-7xl font-bold text-primary-neon uppercase hover-green transition-colors text-left md:pt-0">
                <TypingText text="PROJECTS" />
                <span className="typing-cursor" />
              </h2>
            </div>
            {/* Track: gap 3rem=48px, padding 0 10vw, mt-40=160px md:mt-20=80px */}
            <div
              className="project-track mt-64 md:mt-64"
              ref={projectTrackRef}
            >
              {/* Card 1: Music Maestro — 450×600, rounded-2rem=32px, duration-700 */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "Music Maestro",
                    desc: "An AI-powered app that turns your mood or prompt into a Spotify playlist automatically.",
                    url: "https://music-maestro-lyart.vercel.app/",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[0]}
                  alt="Music Maestro"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-[var(--text)] mb-2 group-hover:text-accent transition-colors">
                    Music Maestro
                  </h4>
                  <p className="text-[var(--text-muted)] mb-8 text-sm">
                    An AI-powered app that turns your mood or prompt into a Spotify playlist automatically.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
                {/* Mobile-only always-on interact badge */}
                <div className="absolute bottom-4 right-4 md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-darker)] border border-accent-40 rounded-full text-accent text-[9px] font-bold uppercase tracking-widest z-10 shadow-lg pointer-events-none">
                  <span>Interact</span>
                  <span className="material-symbols-outlined text-[10px]">north_east</span>
                </div>
              </div>

              {/* Card 2: MixNMatch */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "MixNMatch",
                    desc: "An interactive, keyboard-controlled web drum machine and loop station powered by the Web Audio API.",
                    url: "https://mix-n-match-ten.vercel.app/",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[1]}
                  alt="MixNMatch"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-[var(--text)] mb-2 group-hover:text-accent transition-colors">
                    MixNMatch
                  </h4>
                  <p className="text-[var(--text-muted)] mb-8 text-sm">
                    An interactive, keyboard-controlled web drum machine and loop station powered by the Web Audio API.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
                {/* Mobile-only always-on interact badge */}
                <div className="absolute bottom-4 right-4 md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-darker)] border border-accent-40 rounded-full text-accent text-[9px] font-bold uppercase tracking-widest z-10 shadow-lg pointer-events-none">
                  <span>Interact</span>
                  <span className="material-symbols-outlined text-[10px]">north_east</span>
                </div>
              </div>

              {/* Card 3: Stonks */}
              <div
                className="project-card nav-link group"
                onClick={() =>
                  setModal({
                    title: "Stonks",
                    desc: "A real-time fintech dashboard featuring a RAG-powered AI assistant for smart mutual fund insights.",
                    url: "https://stonks-omega-red.vercel.app/",
                  })
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  src={PROJECT_IMGS[2]}
                  alt="Stonks"
                />
                <div className="project-overlay">
                  <h4 className="text-4xl font-headline font-bold text-[var(--text)] mb-2 group-hover:text-accent transition-colors">
                    Stonks
                  </h4>
                  <p className="text-[var(--text-muted)] mb-8 text-sm">
                    A real-time fintech dashboard featuring a RAG-powered AI assistant for smart mutual fund insights.
                  </p>
                  <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
                    Click to Interact{" "}
                    <span className="material-symbols-outlined text-sm">
                      north_east
                    </span>
                  </div>
                </div>
                {/* Mobile-only always-on interact badge */}
                <div className="absolute bottom-4 right-4 md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-darker)] border border-accent-40 rounded-full text-accent text-[9px] font-bold uppercase tracking-widest z-10 shadow-lg pointer-events-none">
                  <span>Interact</span>
                  <span className="material-symbols-outlined text-[10px]">north_east</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ── py-32=128px, w-80=320px, p-8=32px, rounded-2xl=16px */}
        <section className="py-32 px-8 bg-surface border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-[0.2em] text-primary-neon uppercase mb-16 hover-green transition-colors inline-block">
                <TypingText text="INDUSTRY CERTIFICATIONS" />
                <span className="typing-cursor" />
              </h2>
            </Reveal>
            <Reveal>
              <div className="relative group">
                {/* Left Arrow */}
                {certScroll.left && (
                  <button 
                    onClick={() => scrollCerts("left")}
                    className="absolute left-0 top-1/2 -translate-y-[calc(50%+24px)] z-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--surface-variant)] border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] md:-mt-0 -ml-4 hover:shadow-[0_0_20px_var(--primary)] hover:border-[var(--primary)] group/btn"
                    aria-label="Scroll Left"
                  >
                    <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[var(--text-muted)] mr-1 group-hover/btn:border-r-[var(--primary)] transition-colors" />
                  </button>
                )}
                
                <div
                  className="flex gap-8 overflow-x-auto pb-12 scroll-smooth [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  id="cert-container"
                >
                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Microsoft_Azure_AI_Fundamentals.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    MICROSOFT
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Azure AI Fundamentals (AI-900)
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Credential ID: d9xp-DwW2
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>
                
                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/AWS_Academy_Cloud_Architecture.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    AWS
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    AWS Academy Cloud Architecting
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Amazon Web Services Foundations
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>
                
                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Coursera_Project_Management.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    GOOGLE
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Project Management Foundations
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Agile &amp; Waterfall Methodologies
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>
                
                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Coursera_Digital_Media_and_Marketing_Stategies.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    UNIVERSITY OF ILLINOIS
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Digital Media &amp; Marketing Strategies
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Analytics and Consumer Behavior
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>

                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Coursera_OOP.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    LEARNQUEST
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Object-Oriented Programming with Java
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Software Engineering and Design
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>

                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Coursera_Python.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    UNIVERSITY OF MICHIGAN
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Python Programming
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Data Structures &amp; Algorithms
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>

                <a
                  className="nav-link relative flex-shrink-0 w-80 p-8 pb-16 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl hover:border-accent-40 transition-all group/card"
                  href="/assets/Suyash_Agrawal_Wadhwani_Certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-[10px] font-bold text-accent mb-4 tracking-[0.2em]">
                    WADHWANI FOUNDATION
                  </div>
                  <h4 className="text-[var(--text)] font-bold mb-2 group-hover/card:text-accent transition-colors">
                    Wadhwani Employability Skills
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Core Business &amp; Soft Skills
                  </p>
                  <div className="absolute bottom-6 right-6 flex items-center gap-1 text-[9px] font-bold text-accent tracking-[0.2em] uppercase opacity-50 group-hover/card:opacity-100 transition-opacity">
                    Click to view <span className="material-symbols-outlined text-[10px]">north_east</span>
                  </div>
                </a>
              </div>

              {/* Right Arrow */}
              {certScroll.right && (
                <button 
                  onClick={() => scrollCerts("right")}
                  className="absolute right-0 top-1/2 -translate-y-[calc(50%+24px)] z-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--surface-variant)] border border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] md:-mt-0 -mr-4 hover:shadow-[0_0_20px_var(--primary)] hover:border-[var(--primary)] group/btn"
                  aria-label="Scroll Right"
                >
                  <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[var(--text-muted)] ml-1 group-hover/btn:border-l-[var(--primary)] transition-colors" />
                </button>
              )}
              
              {/* Swipe Indicator */}
              <div className="mt-4 flex items-center justify-center text-accent opacity-60 animate-pulse">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase">&larr; SWIPE &rarr;</span>
              </div>
            </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════
          FOOTER — bg-[var(--surface-dark)], py-40=160px
          ════════════════════════════════════ */}
      <footer
        className="bg-surface-darker py-20 md:py-40 px-8 border-t border-[var(--border-color)]"
        id="contact"
      >
        <div className="max-w-7xl mx-auto">
          {/* mb-24=96px gap-12=48px */}
          <Reveal className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
            <div>
              <h3 className="text-accent font-bold tracking-[0.4em] uppercase mb-4">
                Ready for impact?
              </h3>
              <p className="text-[var(--text-muted)] font-medium mb-8 max-w-md">
                I&apos;m currently open to full-time roles, contracts, and
                collaborations.
              </p>
              {/* text-7xl=72px md:text-9xl=128px leading-[0.9] */}
              <h2 className="font-headline text-5xl md:text-9xl font-black text-[var(--text)] leading-[0.9] hover-green transition-colors">
                LET&apos;S
                <br />
                CONNECT.
              </h2>
            </div>

            {/* Contact grid: p-6=24px rounded-xl=12px gap-4=16px lg:max-w-xl=576px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
              <a
                className="nav-link p-6 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="https://www.linkedin.com/in/suyashagrawal2004/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="w-6 h-6 fill-accent"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-widest group-hover:text-accent transition-colors">
                    LinkedIn
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 group-hover:text-[var(--text-muted)] transition-colors tracking-normal">
                    suyashagrawal2004
                  </span>
                </div>
              </a>
              <a
                className="nav-link p-6 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="https://github.com/suyashagrawal2004"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="w-6 h-6 fill-accent"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-widest group-hover:text-accent transition-colors">
                    GitHub
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 group-hover:text-[var(--text-muted)] transition-colors tracking-normal">
                    suyashagrawal2004
                  </span>
                </div>
              </a>
              <a
                className="nav-link p-6 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="mailto:dm.suyash.a@gmail.com"
              >
                <span className="material-symbols-outlined text-accent text-3xl">
                  mail
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-widest group-hover:text-accent transition-colors">
                    Email
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 group-hover:text-[var(--text-muted)] transition-colors tracking-normal">
                    dm.suyash.a@gmail.com
                  </span>
                </div>
              </a>
              <a
                className="nav-link p-6 bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group"
                href="tel:+919981046888"
              >
                <span className="material-symbols-outlined text-accent text-3xl">
                  call
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-widest group-hover:text-accent transition-colors">
                    Phone
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1 group-hover:text-[var(--text-muted)] transition-colors tracking-normal">
                    (+91) 99810 46888
                  </span>
                </div>
              </a>
            </div>
          </Reveal>

          {/* Bottom bar: mt-32=128px pt-12=48px text-[10px] tracking-[0.4em] */}
          <div className="mt-16 md:mt-32 pt-8 md:pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] text-[var(--text-muted)] uppercase gap-3">
            <div>© 2026 SUYASH AGRAWAL. ALL RIGHTS RESERVED.</div>
            <div className="text-[var(--text-muted)]">
              DESIGNED FOR INNOVATION &amp; SCALE.
            </div>
          </div>
        </div>
      </footer>

      {/* ── Project Modal ── */}
      <AnimatePresence>
        {modal && (
          <ProjectModal
            title={modal.title}
            desc={modal.desc}
            url={modal.url}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        drag="y"
        dragConstraints={{ top: -300, bottom: 300 }}
        dragElastic={0.1}
        onDragStart={() => document.getElementById("custom-cursor")?.classList.add("is-grabbing")}
        onDragEnd={() => document.getElementById("custom-cursor")?.classList.remove("is-grabbing")}
        id="floating-action-bar"
        className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-center gap-5 p-3 pb-6 rounded-full bg-[var(--surface-darker)] border border-[var(--border-color)] shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-md"
      >
        <div className="text-[var(--text-muted)] mb-1">
          <span className="material-symbols-outlined text-[10px] select-none">drag_handle</span>
        </div>
        <a href="tel:+919981046888" className="nav-link text-[var(--text-muted)] hover:text-accent transition-colors" title="(+91) 99810 46888">
          <span className="material-symbols-outlined text-lg">call</span>
        </a>
        <a href="mailto:dm.suyash.a@gmail.com" className="nav-link text-[var(--text-muted)] hover:text-accent transition-colors" title="dm.suyash.a@gmail.com">
          <span className="material-symbols-outlined text-lg">mail</span>
        </a>
        <a href="https://github.com/suyashagrawal2004" className="nav-link text-[var(--text-muted)] hover:text-accent transition-colors" title="suyashagrawal2004" target="_blank" rel="noreferrer">
          <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.028 1.591 1.028 2.682 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/suyashagrawal2004/" className="nav-link text-[var(--text-muted)] hover:text-accent transition-colors mt-2" title="suyashagrawal2004" target="_blank" rel="noreferrer">
          <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </motion.div>
    </>
  );
}
