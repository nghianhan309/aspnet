import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isLoading }) => {
    if (isLoading) {
        return (
            <div className="product-list-loading">
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="product-list-empty">
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
            </div>
        );
    }

    return (
        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
