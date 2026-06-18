import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        setIsLoading(true);
        api.get(`/api/productapi/${id}`)
            .then(res => {
                if (res.data && res.data.success) {
                    setProduct(res.data.data);
                } else {
                    setProduct(null);
                }
            })
            .catch(err => {
                console.error("Error fetching product details:", err);
                setProduct(null);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/600x800?text=No+Image';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stockQuantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Đã thêm ${quantity} sản phẩm ${product.name} vào giỏ hàng!`);
    };

    if (isLoading) {
        return (
            <div className="page-wrapper">
                <Header />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h2>Đang tải thông tin sản phẩm...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-wrapper">
                <Header />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h2>Không tìm thấy sản phẩm.</h2>
                    <Link to="/products" className="btn-outline" style={{ marginTop: '20px', display: 'inline-flex' }}>Quay lại Cửa Hàng</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Header />
            
            <main className="product-detail-page section container">
                <div className="breadcrumb" style={{ marginBottom: '30px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--text-main)' }}>Trang chủ</Link> / 
                    <Link to="/products" style={{ color: 'var(--text-main)', margin: '0 5px' }}>Sản phẩm</Link> / 
                    <span style={{ margin: '0 5px' }}>{product.categoryName}</span> / 
                    <span style={{ color: 'var(--primary)', marginLeft: '5px' }}>{product.name}</span>
                </div>

                <div className="product-detail-layout">
                    {/* Left Column: Image */}
                    <div className="product-gallery">
                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="product-main-image" />
                    </div>

                    {/* Right Column: Info */}
                    <div className="product-info-block">
                        <span className="product-detail-category">{product.categoryName || 'Nước hoa'}</span>
                        <h1 className="product-detail-title">{product.name}</h1>
                        
                        <div className="product-detail-rating" style={{ marginBottom: '20px' }}>
                            <span className="stars" style={{ color: 'var(--accent)', letterSpacing: '2px' }}>★★★★★</span>
                            <span className="reviews-count" style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>(12 đánh giá)</span>
                        </div>

                        <div className="product-detail-price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>

                        <div className="product-detail-stock" style={{ margin: '20px 0', fontSize: '0.95rem' }}>
                            Trạng thái: <strong style={{ color: product.stockQuantity > 0 ? '#10B981' : '#EF4444' }}>
                                {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : 'Hết hàng'}
                            </strong>
                        </div>

                        <div className="product-detail-description">
                            <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                        </div>

                        {product.stockQuantity > 0 && (
                            <div className="product-detail-actions">
                                <div className="quantity-selector">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={increaseQuantity}>+</button>
                                </div>
                                <button className="btn-primary add-to-cart-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center' }} onClick={handleAddToCart}>
                                    Thêm Vào Giỏ Hàng
                                </button>
                            </div>
                        )}
                        
                        <div className="product-detail-perks">
                            <div className="perk-item">
                                <span>✓</span> Cam kết chính hãng 100%
                            </div>
                            <div className="perk-item">
                                <span>✓</span> Miễn phí giao hàng toàn quốc
                            </div>
                            <div className="perk-item">
                                <span>✓</span> Đổi trả miễn phí trong 7 ngày
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
