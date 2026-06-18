import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/api/productapi')
            .then(res => {
                if (res.data && res.data.success) {
                    // Mocks new arrivals by taking the last 4 items, or reversing
                    const reversed = [...res.data.data].reverse();
                    setProducts(reversed.slice(0, 4));
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    if (products.length === 0) return null;

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x400?text=No+Image';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    return (
        <section className="new-arrivals container section">
            <h2 className="section-title text-center">Hàng Mới Về</h2>
            <p className="section-subtitle text-center">Khám phá những mùi hương mới nhất vừa cập bến Nexus Fragrance</p>
            
            <div className="arrival-grid">
                {products.map(product => (
                    <div key={`new-${product.id}`} className="arrival-card">
                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="arrival-image" />
                        <div className="arrival-info">
                            <h3 className="arrival-name">{product.name}</h3>
                            <p className="arrival-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </p>
                            <span className="badge-new">NEW</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;
