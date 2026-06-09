"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <footer className="py-40 px-8 border-t border-[var(--border-color)] relative overflow-hidden bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12"
        >
          <div>
            <h3 className="text-[var(--primary)] font-bold tracking-[0.4em] uppercase mb-4 text-xs">Ready for impact?</h3>
            <p className="text-[var(--text-muted)] font-medium mb-8 max-w-md">I'm currently open to full-time roles, contracts, and collaborations.</p>
            <h2 className="font-headline text-5xl md:text-8xl lg:text-9xl font-black text-[var(--text)] leading-[0.9] hover:text-[var(--primary)] transition-colors duration-500 cursor-default">LET'S<br/>CONNECT.</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
            {['LinkedIn', 'GitHub', 'Email', 'Phone'].map((platform) => (
              <a key={platform} href="#" className="p-6 bg-[var(--surface-variant)] border border-[var(--border-color)] rounded-xl hover:border-[var(--primary)] transition-all flex flex-col gap-4 group nav-link">
                <span className="text-sm font-bold text-[var(--text)] uppercase tracking-widest group-hover:text-[var(--primary)] transition-colors">{platform}</span>
              </a>
            ))}
          </div>
        </motion.div>
        
        <div className="pt-12 border-t border-[var(--border-color)] text-[10px] tracking-[0.4em] text-[var(--text-muted)] uppercase flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 SUYASH AGRAWAL. ALL RIGHTS RESERVED.</span>
          <span className="text-center md:text-right hover:text-[var(--text)] transition-colors duration-300">DESIGNED FOR INNOVATION & SCALE.</span>
        </div>
      </div>
    </footer>
  );
}
