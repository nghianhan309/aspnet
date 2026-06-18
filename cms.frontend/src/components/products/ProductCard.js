import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x400?text=No+Image';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    const handleAddToCart = () => {
        addToCart(product, 1);
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    return (
        <div className="product-card luxury-product-card">
            <div className="product-image-container">
                <Link to={`/product/${product.id}`}>
                    <img src={getImageUrl(product.imageUrl)} alt={product.name} className="product-image" />
                </Link>
                <div className="product-actions-overlay">
                    <button className="action-btn-circle" title="Thêm vào giỏ" onClick={handleAddToCart}>
                        <ShoppingCart size={18} />
                    </button>
                    <Link to={`/product/${product.id}`} className="action-btn-circle" title="Xem chi tiết" style={{ display: 'flex' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </Link>
                </div>
            </div>
            <div className="product-info">
                <span className="product-category">{product.categoryName || 'Nước hoa'}</span>
                <h3 className="product-name">
                    <Link to={`/product/${product.id}`} style={{ color: 'inherit' }}>{product.name}</Link>
                </h3>
                <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="reviews-count">(12)</span>
                </div>
                <div className="product-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
