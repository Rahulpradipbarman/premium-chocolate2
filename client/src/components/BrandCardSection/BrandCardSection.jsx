'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './BrandCardSection.module.css';

// Simple Tabler Icon renderer for the 3 requested icons
const renderIcon = (iconName) => {
  switch (iconName) {
    case 'sparkles':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
          <path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3z" />
        </svg>
      );
    case 'flame':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export default function BrandCardSection({
  heroImage = '',
  brandName = 'Brand',
  sectionTitle = '',
  sectionSubtitle = '',
  cards = []
}) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  
  const [phase, setPhase] = useState(1);
  const [flipped, setFlipped] = useState([false, false, false]);
  const [autoFlippedOnce, setAutoFlippedOnce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.3) {
      if (phase !== 1) setPhase(1);
    } else if (latest < 0.6) {
      if (phase !== 2) setPhase(2);
    } else {
      if (phase !== 3) setPhase(3);
    }
  });

  useEffect(() => {
    if (isMobile) return; 
    
    if (phase >= 3 && !autoFlippedOnce) {
      setAutoFlippedOnce(true);
      const timers = [
        setTimeout(() => setFlipped(prev => [true, prev[1], prev[2]]), 600),
        setTimeout(() => setFlipped(prev => [prev[0], true, prev[2]]), 820),
        setTimeout(() => setFlipped(prev => [prev[0], prev[1], true]), 1040),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (phase < 3 && autoFlippedOnce) {
      setAutoFlippedOnce(false);
      setFlipped([false, false, false]);
    }
  }, [phase, autoFlippedOnce, isMobile]);

  const handleMouseEnter = (i) => {
    if (isMobile || phase < 2) return;
    setFlipped(prev => { const n = [...prev]; n[i] = true; return n; });
  };

  const handleMouseLeave = (i) => {
    if (isMobile || phase < 2) return;
    if (phase < 3) {
      setFlipped(prev => { const n = [...prev]; n[i] = false; return n; });
    }
  };

  const handleClick = (i) => {
    if (phase < 2 && !isMobile) return; 
    setFlipped(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const handleReset = () => {
    if (sectionRef.current) {
      window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'smooth' });
    }
  };

  const getCardAnimateProps = (i) => {
    if (isMobile) {
      return {
        opacity: 1,
        y: 0,
        rotateY: flipped[i] ? 180 : 0,
        rotate: 0,
        x: 0,
        zIndex: flipped[i] ? 10 : 1
      };
    }

    let x = 0, y = 0, rotate = 0, zIndex = 1, scaleY = 1, marginRight = 0, marginLeft = 0;

    if (phase >= 2) {
      if (i === 0) x = -224;
      if (i === 2) x = 224;
    }

    if (phase >= 3) {
      if (i === 0) { rotate = -18; y = 26; x = -236; marginRight = -38; zIndex = 3; }
      else if (i === 1) { rotate = 0; y = 0; zIndex = 5; }
      else if (i === 2) { rotate = 18; y = 26; x = 236; marginLeft = -38; zIndex = 3; }
    }

    if (flipped[i]) {
      if (i === 0) { rotate = -4; y = -14; }
      else if (i === 1) { rotate = 0; y = -18; }
      else if (i === 2) { rotate = 4; y = -14; }
      zIndex = 10;
    }

    return {
      opacity: phase >= 2 ? 1 : 0,
      x, y, rotate, rotateY: flipped[i] ? 180 : 0, zIndex, marginRight, marginLeft,
      scaleY: phase === 2 && i === 1 && !flipped[i] ? 1 : 1
    };
  };

  const getCardTransition = (i) => {
    if (isMobile) {
      return { duration: 0.5 };
    }
    if (phase === 2 && !flipped[i]) {
      return { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 };
    }
    if (phase >= 3 && !flipped[i]) {
      return { duration: 0.6, ease: [0.4, 0, 0.2, 1] };
    }
    if (flipped[i]) {
      return { duration: 0.75, ease: 'easeOut' };
    }
    return { duration: 0.4 };
  };

  const getCardInitialProps = (i) => {
    if (isMobile) return { opacity: 1, y: 0, rotateY: 0 };
    return {
      opacity: 0,
      x: 0, y: 0, rotate: 0, rotateY: 0,
      scaleY: i === 1 ? 0.85 : 1
    };
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stickyContainer}>
        {/* Section Title */}
        {sectionTitle && (
          <h2 className={styles.sectionHeader}>{sectionTitle}</h2>
        )}

        {/* Phase 1: LED Screen */}
        <AnimatePresence>
          {phase < 2 && !isMobile && (
            <motion.div
              key="led-screen"
              className={styles.ledScreen}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: phase === 1 ? 0.7 : 0.4, ease: 'easeOut' }}
            >
              <div className={styles.scanline}></div>
              {heroImage ? (
                <div 
                  className={styles.ledImage} 
                  style={{ backgroundImage: `url(${heroImage})` }} 
                />
              ) : (
                <div className={styles.ledPlaceholder}>
                  <div className={styles.brandIconPlaceholder}>✦</div>
                  <div className={styles.brandWordmark}>{brandName}</div>
                </div>
              )}
              <div className={styles.brandBadge}>{brandName}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2 & 3: Cards */}
        <div className={styles.cardsContainer}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className={styles.cardWrapper}
              initial={getCardInitialProps(i)}
              animate={getCardAnimateProps(i)}
              transition={getCardTransition(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onClick={() => handleClick(i)}
              style={{
                position: isMobile ? 'relative' : 'absolute'
              }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div 
                    className={styles.cardImage} 
                    style={{
                      backgroundImage: isMobile ? `url(/images/card_mobile_${i + 1}.png)` : (heroImage ? `url(${heroImage})` : 'none'),
                      backgroundPosition: isMobile ? 'center' : (i === 0 ? '0% center' : i === 1 ? '50% center' : '100% center'),
                      backgroundSize: isMobile ? 'cover' : '300% 100%',
                      backgroundColor: heroImage ? 'transparent' : '#222'
                    }}
                  />
                  <div className={styles.cardBottom}>
                    <span className={styles.cardTag}>{card.tag}</span>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardHint}>Click to reveal</p>
                  </div>
                </div>

                <div className={styles.cardBack}>
                  <div 
                    className={styles.cardBackTop} 
                    style={{ backgroundColor: card.accentColor }}
                  >
                    {renderIcon(card.icon)}
                  </div>
                  <div className={styles.cardBackBottom}>
                    <div 
                      className={styles.accentBar} 
                      style={{ backgroundColor: card.accentColor }}
                    />
                    <span className={styles.backLabel}>{card.tag}</span>
                    <h4 className={styles.backTitle}>{card.backTitle}</h4>
                    <p className={styles.backBody}>{card.backBody}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reset Button */}
        <AnimatePresence>
          {phase === 3 && !isMobile && (
            <motion.button
              className={styles.resetBtn}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
              onClick={handleReset}
            >
              Reset Sequence
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
