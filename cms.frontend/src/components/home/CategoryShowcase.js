import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const luxuryCats = [
            { id: 1, name: 'Nước Hoa Nam', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80', link: '/products/male' },
            { id: 2, name: 'Nước Hoa Nữ', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80', link: '/products/female' },
            { id: 3, name: 'Nước Hoa Unisex', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=80', link: '/products/unisex' },
        ];
        setCategories(luxuryCats);
    }, []);

    return (
        <section className="category-showcase container section">
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <p className="section-subtitle">Bộ sưu tập nước hoa được yêu thích nhất</p>
            <div className="category-grid" style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                {categories.map((cat, index) => (
                    <Link key={cat.id || index} to={cat.link} className="category-card luxury-card" style={{ textDecoration: 'none', borderRadius: '50%', overflow: 'hidden', width: '250px', height: '250px', display: 'block', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img
                            src={cat.image}
                            alt={cat.name}
                            className="category-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="category-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <h3 className="category-name" style={{ fontSize: '1.5rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;

