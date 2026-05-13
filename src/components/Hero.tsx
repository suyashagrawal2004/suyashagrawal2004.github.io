"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import BrainNetwork from "./BrainNetwork";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 pt-20">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="mb-6 inline-block px-3 py-1 bg-accent-primary/10 border border-[var(--accent-primary)]/20 rounded text-[10px] font-bold tracking-[0.3em] text-[var(--accent-primary)] uppercase">
            AI Engineer & Product Manager
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[var(--accent-primary)] leading-none mb-8">
            SUYASH AGRAWAL
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-main)] opacity-80 max-w-xl leading-relaxed">
            Building resilient <span className="font-medium opacity-100">LLM systems</span> and <span className="font-medium opacity-100">Autonomous Agents</span>. Currently architecting intelligent workflows for international scale.
          </p>
          <div className="flex gap-6 mt-12">
            <button className="px-8 py-4 border border-white/10 text-text-main text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all">
              Download CV
            </button>
            <button className="px-8 py-4 bg-[var(--accent-primary)] text-bg-primary text-xs font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-all shadow-[0_0_20px_var(--accent-primary)] hover:shadow-[0_0_30px_var(--accent-primary)]">
              Get in Touch
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
        >
           <div className="w-full aspect-square md:aspect-[3/4] max-w-md rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 relative shadow-2xl" style={{ touchAction: "none" }}>
             <Canvas camera={{ position: [0, 0, 8] }} className="w-full h-full block cursor-crosshair">
                 <BrainNetwork />
             </Canvas>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
