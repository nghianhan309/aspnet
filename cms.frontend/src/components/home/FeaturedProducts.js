import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/api/productapi')
            .then(res => {
                if (res.data && res.data.success) {
                    setProducts(res.data.data.slice(0, 4));
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="featured-products container section">
            <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
                <h2 className="section-title" style={{margin: 0}}>Sản Phẩm Nổi Bật</h2>
                <a href="/products" className="view-all" style={{textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', borderBottom: '1px solid var(--primary)', paddingBottom: '3px'}}>Xem tất cả</a>
            </div>
            
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
