import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 80;

  useEffect(() => {
    // Preload images for canvas
    const loadedImages = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${String(i).padStart(3, '0')}.jpg`;
      
      if (i === 0) {
        img.onload = () => {
          if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        };
      }
      
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current || images.length === 0) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      let scrollFraction = 0;
      // Start animating when the container top hits the top of the viewport
      if (rect.top <= 0) {
        const maxScroll = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        scrollFraction = Math.max(0, Math.min(1, scrolled / maxScroll));
      }

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      if (images[frameIndex] && images[frameIndex].complete) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        requestAnimationFrame(() => {
          context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  return (
    <div>
      {/* Scroll-linked animation container */}
      <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, overflow: 'hidden' }}>
           <canvas 
             ref={canvasRef} 
             width="1920" 
             height="1080" 
             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
           />
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,6,4,0.4) 0%, rgba(10,6,4,0.8) 100%)' }}></div>
           
           {/* Hero Text */}
           <section style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
             <div className="container">
               <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Noir Luxe</h1>
               <p style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 300, color: '#f5ecd7' }}>
                 Experience the ultimate premium artisan chocolate sensation.
               </p>
               <Link to="/shop" className="btn">Shop Collection</Link>
             </div>
           </section>
        </div>
      </div>

      {/* Static Sections */}
      <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--color-bg)' }}>
        
        {/* Craftsmanship Section */}
        <section className="craftsmanship" style={{ padding: 'var(--space-8) 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <img src="/images/craftsmanship.png" alt="Master Chocolatier" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} loading="lazy" />
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>The Art of Craftsmanship</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', opacity: 0.8, marginBottom: 'var(--space-4)', lineHeight: 1.8 }}>
                Every Noir Luxe creation is born from a meticulous obsession with quality. We source the rarest single-origin cacao from sustainable estates, carefully roasting and conching them to unlock their deepest, most complex flavor profiles. 
              </p>
              <Link to="/our-story" className="btn btn-secondary">Discover Our Process</Link>
            </div>
          </div>
        </section>

        {/* The Velour Standard */}
        <section className="velour-standard" style={{ padding: 'var(--space-8) 0', backgroundColor: '#fdfbf7', color: '#2c1e16' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-6)', color: '#d4af37' }}>The Velour Standard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
               <div style={{ padding: 'var(--space-4)', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                 <div style={{ margin: '0 auto var(--space-3)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5ecd7', borderRadius: '50%', color: '#d4af37' }}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </div>
                 <h3 style={{ marginBottom: 'var(--space-2)' }}>Ethical Sourcing</h3>
                 <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>We pay a premium to farmers, ensuring sustainable practices and exceptional bean quality.</p>
               </div>
               <div style={{ padding: 'var(--space-4)', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                 <div style={{ margin: '0 auto var(--space-3)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5ecd7', borderRadius: '50%', color: '#d4af37' }}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 </div>
                 <h3 style={{ marginBottom: 'var(--space-2)' }}>Masterful Conching</h3>
                 <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Extended conching times create our signature velvet-smooth texture that melts on the palate.</p>
               </div>
               <div style={{ padding: 'var(--space-4)', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                 <div style={{ margin: '0 auto var(--space-3)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5ecd7', borderRadius: '50%', color: '#d4af37' }}>
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                 </div>
                 <h3 style={{ marginBottom: 'var(--space-2)' }}>Artisan Presentation</h3>
                 <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>Each bar is carefully inspected and hand-wrapped in our luxurious signature packaging.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Blog / Reviews Section */}
        <section className="reviews container" style={{ padding: 'var(--space-8) var(--space-3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-6)', color: 'var(--color-primary)' }}>What They Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            
            <div className="review-card" style={{ padding: '2.5rem var(--space-4)', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', position: 'relative' }}>
              <div className="reviewer-img-container" style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--color-bg)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <img src="/images/reviewer_1.png" alt="Julian Vane" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-3)', color: 'var(--color-text)', opacity: 0.9, fontSize: '1rem' }}>
                  "The most profound chocolate experience I've ever had. The Madagascar single origin is a revelation of complex flavor."
                </p>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>Julian Vane</h4>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Gastronomy Critic</p>
              </div>
            </div>

            <div className="review-card" style={{ padding: '2.5rem var(--space-4)', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', position: 'relative' }}>
              <div className="reviewer-img-container" style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--color-bg)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <img src="/images/reviewer_2.png" alt="Elena Moretti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-3)', color: 'var(--color-text)', opacity: 0.9, fontSize: '1rem' }}>
                  "Noir Luxe has redefined the luxury chocolate standard. Their salted caramel ganache is an absolute masterpiece of texture."
                </p>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>Elena Moretti</h4>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Lifestyle Influencer</p>
              </div>
            </div>

            <div className="review-card" style={{ padding: '2.5rem var(--space-4)', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', position: 'relative' }}>
              <div className="reviewer-img-container" style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--color-bg)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <img src="/images/reviewer_3.png" alt="Nano Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>★★★★★</div>
                <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-3)', color: 'var(--color-text)', opacity: 0.9, fontSize: '1rem' }}>
                  "A masterclass in restraint and quality. The perfect gift for the true chocolate connoisseur who appreciates the finer details."
                </p>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px' }}>Nano Banana</h4>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Artisan Specialist</p>
              </div>
            </div>

          </div>
        </section>

        {/* Article / Recipes Section */}
        <section className="recipes" style={{ padding: 'var(--space-8) 0', backgroundColor: 'var(--color-surface)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', margin: 0 }}>Decadent Recipes</h2>
                <p style={{ color: 'var(--color-text)', opacity: 0.8, marginTop: 'var(--space-2)' }}>Elevate your desserts with Noir Luxe.</p>
              </div>
              <Link to="/articles" className="btn btn-secondary" style={{ display: 'none' }}>View All</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              <Link to="/articles" className="recipe-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', group: 'true' }}>
                <div style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: 'var(--space-3)', aspectRatio: '4/3' }}>
                  <img src="/images/hazelnut_velvet.png" alt="Dark Chocolate Fondant" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>Classic Dark Chocolate Fondant</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>A molten core of 85% Noir Luxe, perfect for dinner parties.</p>
              </Link>
              <Link to="/articles" className="recipe-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', group: 'true' }}>
                <div style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: 'var(--space-3)', aspectRatio: '4/3' }}>
                  <img src="/images/salted_caramel.png" alt="Chocolate Tart" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>Sea Salt Caramel Tart</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>A buttery crust filled with rich ganache and flaky sea salt.</p>
              </Link>
              <Link to="/articles" className="recipe-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', group: 'true' }}>
                <div style={{ overflow: 'hidden', borderRadius: '8px', marginBottom: 'var(--space-3)', aspectRatio: '4/3' }}>
                  <img src="/images/gold_leaf.png" alt="Truffles" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-1)' }}>Hand-Rolled Cocoa Truffles</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Create your own luxurious truffles at home.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Register Now Section */}
        <section className="register-cta" style={{ padding: 'var(--space-8) 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/madagascar.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)', zIndex: -1 }}></div>
          <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)', color: '#fff' }}>Join the Noir Luxe Society</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-6)', color: 'rgba(255,255,255,0.8)' }}>
              Become a member to receive exclusive access to limited-edition releases, private tasting events, and complimentary expedited shipping.
            </p>
            <Link to="/signup" className="btn" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Register Now</Link>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default Home;
