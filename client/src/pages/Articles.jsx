import React, { useState } from 'react';

const articles = [
  { id: 1, title: "The Art of Bean-to-Bar: What Makes Chocolate Truly Luxurious", category: "Craft", excerpt: "Discover the meticulous process that transforms humble cacao beans into a velvet-smooth masterpiece of flavor.", time: "5 min read", image: "/images/dark_noir.png" },
  { id: 2, title: "Why Single Origin Matters: A Journey to Madagascar", category: "Stories", excerpt: "Trace the roots of our signature dark chocolate back to the lush, sun-drenched estates of Madagascar.", time: "8 min read", image: "/images/madagascar.png" },
  { id: 3, title: "Pairing Chocolate with Wine: A Sommelier's Guide", category: "Pairing", excerpt: "Elevate your tasting experience with expert recommendations on matching dark chocolate with fine wines.", time: "6 min read", image: "/images/signature_box.png" },
  { id: 4, title: "The Science Behind Dark Chocolate's Health Benefits", category: "Health", excerpt: "Unveil the powerful antioxidants and neuro-benefits hidden within high-percentage dark chocolate.", time: "4 min read", image: "/images/smoked_almond.png" },
  { id: 5, title: "Behind the Scenes: How Our Truffles Are Hand-Crafted", category: "Craft", excerpt: "Step inside the Luxe Noir atelier and watch our master chocolatiers at work, rolling and dusting each truffle by hand.", time: "7 min read", image: "/images/truffle_box.png" },
  { id: 6, title: "The History of Cacao: From Ancient Ritual to Modern Indulgence", category: "Stories", excerpt: "Journey through time and explore how cacao evolved from a sacred Mayan drink to the luxury bars of today.", time: "10 min read", image: "/images/earl_grey.png" }
];

const categories = ["All", "Craft", "Health", "Pairing", "Stories"];

const Articles = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredArticles = activeFilter === "All" 
    ? articles 
    : articles.filter(a => a.category === activeFilter);

  return (
    <div className="page" style={{ paddingTop: '100px' }}>
      <div className="container section-padding">
        <div className="page-header">
          <h1>The Luxe Noir Journal</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Stories of craftsmanship, provenance, and the pursuit of chocolate perfection.
          </p>
        </div>

        <div className="filters">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="article-grid">
          {filteredArticles.map(article => (
            <div key={article.id} className="article-card">
              <div className="article-image-wrap">
                <img src={article.image} alt={article.title} className="article-image" loading="lazy" />
              </div>
              <div>
                <span className="article-tag">{article.category}</span>
                <h3 className="article-title" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-meta">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{article.time}</span>
                  <button className="article-read-more">Read More <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
