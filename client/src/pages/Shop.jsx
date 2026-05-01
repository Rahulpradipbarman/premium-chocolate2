import React from 'react';
import { useCart } from '../context/CartContext';

const products = [
  { id: 1, name: "Dark Noir 85%", desc: "85% cacao, cold-pressed, ethically sourced", price: 499, image: "/images/dark_noir.png" },
  { id: 2, name: "Salted Caramel Ganache", desc: "Silky caramel with Himalayan pink salt", price: 649, image: "/images/salted_caramel.png" },
  { id: 3, name: "Single Origin Madagascar", desc: "Notes of cherry and roasted almond", price: 899, image: "/images/madagascar.png" },
  { id: 4, name: "Truffle Collection Box", desc: "9 assorted handcrafted artisan truffles", price: 1299, image: "/images/truffle_box.png" },
  { id: 5, name: "Rose & Raspberry Bar", desc: "Infused with organic rose petals and berries", price: 549, image: "/images/rose_raspberry.png" },
  { id: 6, name: "Smoked Almond Bark", desc: "Hickory-smoked almonds in 70% dark", price: 479, image: "/images/smoked_almond.png" },
  { id: 7, name: "Gold Leaf Praline", desc: "Hazelnut praline dusted with 24k gold", price: 749, image: "/images/gold_leaf.png" },
  { id: 8, name: "Hazelnut Velvet", desc: "Creamy gianduja with whole roasted hazelnuts", price: 599, image: "/images/hazelnut_velvet.png" },
  { id: 9, name: "Earl Grey Infusion", desc: "Bergamot-infused 65% dark chocolate", price: 629, image: "/images/earl_grey.png" },
  { id: 10, name: "Signature Noir Gift Box", desc: "The ultimate curated tasting experience", price: 1799, image: "/images/signature_box.png" }
];

const Shop = () => {
  const { addToCart } = useCart();

  return (
    <div className="page" style={{ paddingTop: '100px' }}>
      <div className="container section-padding">
        <div className="page-header">
          <h1>The Collection</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Discover our meticulously crafted artisanal chocolates, designed for the refined palate.
          </p>
        </div>

        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                <div className="product-overlay"></div>
                <div className="product-add">
                  <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                <p className="product-price">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
