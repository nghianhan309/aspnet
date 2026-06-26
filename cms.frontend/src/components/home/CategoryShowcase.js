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
            <div className="category-grid">
                {categories.map((cat, index) => (
                    <Link key={cat.id || index} to={cat.link} className="category-card luxury-card" style={{ textDecoration: 'none' }}>
                        <img
                            src={cat.image}
                            alt={cat.name}
                            className="category-image"
                        />
                        <div className="category-overlay">
                            <h3 className="category-name">{cat.name}</h3>
                            <span className="btn-outline discover-btn">Khám Phá</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;

