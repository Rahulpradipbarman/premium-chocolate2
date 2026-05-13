import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';

const cellsData = [
  { id: 1, label: "01 · FARM", desc: "Theobroma cacao", bg: "url('/images/nano_farm.png') center/cover", group: 0 },
  { id: 2, label: "02 · HARVEST", desc: "Hand-picked pods", bg: "url('/images/step2_harvest.png') center/cover", group: 1 },
  { id: 3, label: "03 · FERMENT", desc: "6-day box ferment", bg: "url('/images/step3_ferment.png') center/cover", group: 2 },
  { id: 4, label: "04 · DRY", desc: "Sun-dried 14 days", bg: "url('/images/step4_dry.png') center/cover", group: 0 },
  { id: 5, label: "05 · ROAST", desc: "120°C drum roast", bg: "url('/images/step5_roast.png') center/cover", group: 1 },
  { id: 6, label: "06 · CRACK", desc: "Separating the nibs", bg: "url('/images/step6_crack.png') center/cover", group: 2 },
  { id: 7, label: "07 · CONCHE", desc: "72-hour stone grind", bg: "url('/images/step7_conche.png') center/cover", group: 0 },
  { id: 8, label: "08 · TEMPER", desc: "27°C precision cool", bg: "url('/images/step8_temper.png') center/cover", group: 1 },
  { id: 9, label: "09 · POUR", desc: "Hand-poured molds", bg: "url('/images/step9_pour.png') center/cover", group: 2 },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 480px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);
  return isMobile;
}

function ParallaxCell({ cell, scrollYProgress }) {
  const isReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  const offset = cell.group === 0 ? 0 : cell.group === 1 ? 0.06 : 0.12;
  
  const yRange = isMobile ? [55, 0, -35] : [110, 0, -70];
  const rxRange = isMobile ? [0, 0, 0, 0] : [14, 0, 0, -7];
  const skRange = isMobile ? [0, 0, 0] : [5, 0, 0];
  const blRange = isMobile ? [6, 0, 0, 6] : [14, 0, 0, 6];

  const rawY = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 1], yRange);
  const rawSc = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 1], [0.83, 1, 0.92]);
  const rawRx = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 0.65 + offset, 1], rxRange);
  const rawSk = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 1], skRange);
  const rawBl = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 0.65 + offset, 1], blRange);
  const rawBr = useTransform(scrollYProgress, [0 + offset, 0.4 + offset, 0.65 + offset, 1], [0.55, 1, 1, 0.72]);

  const filter = useMotionTemplate`blur(${rawBl}px) brightness(${rawBr})`;
  const innerScale = useTransform(scrollYProgress, [0 + offset, 0.5 + offset, 1], [0.88, 1.04, 0.96]);

  const y = isReducedMotion ? 0 : rawY;
  const scale = isReducedMotion ? 1 : rawSc;
  const rotateX = isReducedMotion ? 0 : rawRx;
  const skewY = isReducedMotion ? 0 : rawSk;
  const finalFilter = isReducedMotion ? "blur(0px) brightness(1)" : filter;
  const finalInnerScale = isReducedMotion ? 1 : innerScale;

  return (
    <motion.div
      style={{
        y,
        scale,
        rotateX,
        skewY,
        filter: finalFilter,
        willChange: "transform",
        transformPerspective: 1000,
        aspectRatio: "3/4",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          scale: finalInnerScale,
          width: "100%",
          height: "100%",
          background: cell.bg,
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform"
        }}
      />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ 
            fontSize: "clamp(9px, 2.5vw, 11px)", 
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)", 
            letterSpacing: "0.08em", 
            margin: "0 0 4px 10px",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)"
          }}
        >
          {cell.desc}
        </motion.div>
        <div style={{ 
          fontSize: "clamp(10px, 3.5vw, 12px)", 
          fontWeight: 800,
          letterSpacing: "0.14em", 
          color: "#ffffff", 
          margin: "0 0 10px 10px",
          textShadow: "0 2px 4px rgba(0,0,0,0.8)"
        }}>
          {cell.label}
        </div>
      </div>
    </motion.div>
  );
}

export default function CinematicParallax() {
  const sectionRef = useRef(null);
  const isReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  
  const textXRaw = useTransform(scrollYProgress, [0, 1], ["8%", "-60%"]);
  const textX = isReducedMotion ? 0 : textXRaw;
  
  const textContent = "FARM · HARVEST · FERMENT · ROAST · CONCHE · TEMPER · POUR · REST · TASTE · ".repeat(3);

  return (
    <section ref={sectionRef} style={{ position: "relative", overflow: "hidden", background: "#0D0500", padding: "80px 0 120px" }}>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", paddingTop: "80px", marginBottom: "60px", position: "relative", zIndex: 2 }}
      >
        <div style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#7A4020", textTransform: "uppercase", marginBottom: "16px" }}>
          THE JOURNEY
        </div>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 60px)", fontWeight: 300, color: "#F5E6D3", margin: 0 }}>
          From Soil to Soul
        </h2>
        <div style={{ width: "1px", height: "36px", background: "#3C2214", margin: "20px auto" }}></div>
        <div style={{ fontSize: "13px", color: "#A07850", letterSpacing: "0.1em" }}>
          Nine steps. One obsession.
        </div>
      </motion.div>

      <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: "100%", overflow: "visible", pointerEvents: "none", zIndex: 10 }}>
        <motion.div
          style={{
            x: textX,
            fontSize: "clamp(42px, 12vw, 110px)",
            fontWeight: 900,
            letterSpacing: "0.18em",
            color: "#d4af37",
            whiteSpace: "nowrap",
            mixBlendMode: "normal",
            fontFamily: "inherit",
          }}
        >
          {textContent}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .parallax-grid-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          perspective: 1200px;
          transform: perspective(1200px);
        }
        .parallax-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .parallax-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          /* Hide the 9th item so we have exactly 8 items (perfect 2-column grid) */
          .parallax-grid > div:last-child {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .parallax-grid {
            /* Keep 2 columns on mobile to preserve the parallax grid aesthetic */
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}} />

      <div className="parallax-grid-container">
        <div className="parallax-grid">
          {cellsData.map(cell => (
            <ParallaxCell key={cell.id} cell={cell} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
      
    </section>
  );
}
