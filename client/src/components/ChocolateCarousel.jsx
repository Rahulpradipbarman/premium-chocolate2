import React, { useEffect, useRef } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';

// Injects elegant fonts for the premium look
const ElegantFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap');
  `}</style>
);

const FLAVORS = [
  {
    id: 1,
    name: "Dark Ecuadorian 72%",
    origin: "Ecuador",
    notes: ["Blackberry", "Tobacco", "Oak"],
    description: "Intense dark chocolate with deep earthy notes and a subtle fruit finish.",
    color: "#2C1E16",
    image: "/images/flavor_ecuadorian.png"
  },
  {
    id: 2,
    name: "Madagascar Vanilla Bean",
    origin: "Madagascar",
    notes: ["Vanilla", "Honey", "Cream"],
    description: "Smooth white chocolate infused with authentic bourbon vanilla.",
    color: "#F5E6D3",
    image: "/images/flavor_madagascar.png"
  },
  {
    id: 3,
    name: "Peruvian Sea Salt Caramel",
    origin: "Peru",
    notes: ["Caramel", "Sea Salt", "Butter"],
    description: "Rich milk chocolate enveloping a luscious salted caramel center.",
    color: "#C8956B",
    image: "/images/flavor_peruvian.png"
  },
  {
    id: 4,
    name: "Venezuelan Criollo 85%",
    origin: "Venezuela",
    notes: ["Plum", "Espresso", "Leather"],
    description: "Exceptional pure criollo cacao offering a robust, unsweetened depth.",
    color: "#1A0F0A",
    image: "/images/flavor_venezuelan.png"
  },
  {
    id: 5,
    name: "Dominican Spiced Mocha",
    origin: "Dominican Republic",
    notes: ["Coffee", "Cinnamon", "Chili"],
    description: "A warming blend of dark chocolate, roasted espresso, and subtle heat.",
    color: "#5C3A21",
    image: "/images/flavor_dominican.png"
  },
  {
    id: 6,
    name: "Colombian Golden Berry",
    origin: "Colombia",
    notes: ["Citrus", "Tart", "Floral"],
    description: "Bright milk chocolate contrasting with the sharp tang of golden berries.",
    color: "#D4AF37",
    image: "/images/flavor_colombian.png"
  },
  {
    id: 7,
    name: "Ghanaian Hazelnut Praline",
    origin: "Ghana",
    notes: ["Roasted Nuts", "Nougat", "Malt"],
    description: "Classic creamy milk chocolate folded with crunchy caramelized hazelnuts.",
    color: "#8B5A2B",
    image: "/images/flavor_ghanaian.png"
  },
  {
    id: 8,
    name: "Bolivian Wild Cacao",
    origin: "Bolivia",
    notes: ["Wildflower", "Honey", "Nutmeg"],
    description: "Foraged rare cacao beans yielding an unpredictable, enchanting flavor profile.",
    color: "#3E2723",
    image: "/images/flavor_bolivian.png"
  }
];

const CARD_WIDTH = 300;
const CARD_MARGIN = 24;
const SINGLE_SET_WIDTH = FLAVORS.length * (CARD_WIDTH + CARD_MARGIN);
const ANIMATION_DURATION = 40; // Elegant, slow speed

const ChocolateCarousel = () => {
  const x = useMotionValue(0);
  const controlsRef = useRef(null);
  const isHoveredOrDragged = useRef(false);

  const startAnimation = () => {
    if (isHoveredOrDragged.current) return;

    let currentX = x.get();
    
    // Wrap around instantly if we've scrolled past the first set
    if (currentX <= -SINGLE_SET_WIDTH) {
      currentX = 0;
      x.set(0);
    }
    
    // Calculate distance remaining to complete the scroll of one full set
    const distanceToTravel = SINGLE_SET_WIDTH + currentX; // currentX is negative
    
    if (distanceToTravel <= 0) {
      x.set(0);
      setTimeout(startAnimation, 10);
      return;
    }

    // Maintain constant speed regardless of where the animation is resuming from
    const duration = (distanceToTravel / SINGLE_SET_WIDTH) * ANIMATION_DURATION;

    controlsRef.current = animate(x, -SINGLE_SET_WIDTH, {
      ease: "linear",
      duration: duration,
      onComplete: () => {
        x.set(0);
        startAnimation();
      }
    });
  };

  useEffect(() => {
    startAnimation();
    return () => controlsRef.current?.stop();
  }, []);

  const handlePointerDown = () => {
    isHoveredOrDragged.current = true;
    controlsRef.current?.stop();
  };

  const handlePointerUp = () => {
    isHoveredOrDragged.current = false;
    startAnimation();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: '100px 0',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background-color 0.3s ease'
      }}
    >
      <ElegantFonts />
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{
          color: 'var(--color-text)',
          fontFamily: "'Playfair Display', serif",
          fontSize: '3.5rem',
          margin: '0 0 16px 0',
          fontWeight: 400,
          letterSpacing: '0.02em',
          transition: 'color 0.3s ease'
        }}>
          Explore the Collection
        </h2>
        <div style={{
          width: '80px',
          height: '1px',
          backgroundColor: 'var(--color-primary)',
          margin: '0 auto',
          opacity: 0.6
        }} />
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        {/* Edge Fade Gradients for Hinting Content */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--color-bg) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'background 0.3s ease'
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--color-bg) 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'background 0.3s ease'
        }} />

        <motion.div
          style={{
            display: 'flex',
            width: 'max-content',
            x: x,
            padding: '20px 0',
            cursor: 'grab'
          }}
          drag="x"
          dragConstraints={{ right: 0, left: -SINGLE_SET_WIDTH }}
          whileDrag={{ cursor: 'grabbing' }}
          onHoverStart={handlePointerDown}
          onHoverEnd={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Duplicate the flavors array to create a seamless infinite loop */}
          {[...FLAVORS, ...FLAVORS].map((flavor, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03, borderColor: '#7A4020' }}
              style={{
                width: `${CARD_WIDTH}px`,
                height: '420px',
                marginRight: `${CARD_MARGIN}px`,
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Image background covering 100% */}
              <img 
                src={flavor.image} 
                alt={flavor.name} 
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: 1
                }} 
              />

              {/* Sophisticated Gradient Overlay for text visibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,5,0,0.95) 0%, rgba(13,5,0,0.4) 40%, rgba(13,5,0,0) 100%)',
                zIndex: 1
              }} />
              
              {/* Content area positioned over the image/overlay */}

              <div style={{ 
                position: 'relative',
                zIndex: 2,
                padding: '32px 24px', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                justifyContent: 'flex-end'
              }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: 'rgba(60, 34, 20, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#F5C89A',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {flavor.origin}
                  </span>
                </div>

                <h3 style={{
                  color: '#F5E6D3',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {flavor.name}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {flavor.notes.map((note, i) => (
                    <span key={i} style={{
                      backgroundColor: 'rgba(42, 15, 0, 0.6)',
                      backdropFilter: 'blur(2px)',
                      color: '#C8956B',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: "'Inter', sans-serif",
                      border: '1px solid rgba(200, 149, 107, 0.2)'
                    }}>
                      {note}
                    </span>
                  ))}
                </div>

                <p style={{
                  color: '#D4AF37',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0,
                  opacity: 0.9,
                  fontWeight: 300
                }}>
                  {flavor.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ChocolateCarousel;
