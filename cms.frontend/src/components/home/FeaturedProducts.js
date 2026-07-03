import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ProductCard from '../products/ProductCard';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/api/productapi/bestselling?count=3')
            .then(res => {
                if (res.data && res.data.success) {
                    setProducts(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="featured-products section" style={{ backgroundColor: '#F9F8F6', padding: '100px 0' }}>
            <div className="container">
                <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px', textAlign: 'center' }}>
                    <span style={{ color: '#D4AF37', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '15px' }}>Top Lựa Chọn</span>
                    <h2 className="section-title" style={{ margin: '0', fontSize: '3.2rem', fontFamily: "'Playfair Display', serif", color: '#111' }}>Sản Phẩm Hot / Bán Chạy</h2>
                    <div style={{ width: '80px', height: '2px', backgroundColor: '#D4AF37', margin: '25px auto 0' }}></div>
                </div>
                
                <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <a href="/products" className="btn-outline-dark" style={{ padding: '15px 45px', letterSpacing: '2px' }}>Khám Phá Tất Cả</a>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
