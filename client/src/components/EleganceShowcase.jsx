import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './EleganceShowcase.css';

const EleganceShowcase = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameCount = 80;
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);
  const [frame, setFrame] = useState(0);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    setFrame(Math.floor(latest));
  });

  useEffect(() => {
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/stop_motion/motion/Woman_eating_finishing_chocolate_202605120023_${String(i).padStart(3, '0')}.jpg`;
    }
  }, []);

  const currentImage = `/stop_motion/motion/Woman_eating_finishing_chocolate_202605120023_${String(frame).padStart(3, '0')}.jpg`;

  return (
    <section ref={containerRef} className="elegance-showcase">
      <div className="elegance-container">
        {/* Left Side: Sticky Animation */}
        <div className="elegance-left">
           <motion.img 
             src={currentImage} 
             alt="Elegance Showcase"
             className="elegance-image"
             style={{ scale }}
           />
           <div className="elegance-gradient" />
        </div>

        {/* Right Side: Scrolling Content */}
        <div className="elegance-right">
          <div className="elegance-block">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="elegance-heading">Crafted with timeless precision.</h2>
              <p className="elegance-text">
                Every delicate piece is an homage to the classic art of chocolate-making, elevating simple ingredients into an experience that lingers far beyond the last bite.
              </p>
            </motion.div>
          </div>

          <div className="elegance-block">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="elegance-heading">Elegance engineered into every curve.</h2>
              <p className="elegance-text">
                Meticulously sculpted and flawlessly finished. Our artisan process guarantees a texture so smooth, it redefines the very essence of luxury.
              </p>
            </motion.div>
          </div>

          <div className="elegance-block">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="elegance-heading">Luxury in motion.</h2>
              <p className="elegance-text">
                Taste the culmination of passion and perfection. A truly cinematic journey for the palate, designed exclusively to be admired and savored.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EleganceShowcase;
