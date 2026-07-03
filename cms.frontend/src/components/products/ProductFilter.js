import React from 'react';

const ProductFilter = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
    return (
        <aside className="product-filter">
            <div className="filter-section">
                <h3 className="filter-title">Danh Mục</h3>
                <ul className="filter-list">
                    <li className={selectedCategory === '' ? 'active' : ''}>
                        <button onClick={() => onCategoryChange('')}>Tất cả sản phẩm</button>
                    </li>
                    {categories.map((cat, index) => (
                        <li key={index} className={selectedCategory === cat ? 'active' : ''}>
                            <button onClick={() => onCategoryChange(cat)}>{cat}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-section">
                <h3 className="filter-title">Khoảng Giá</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    <input 
                        type="number" 
                        placeholder="Giá thấp nhất (VNĐ)" 
                        value={priceRange.min} 
                        onChange={(e) => onPriceChange({ ...priceRange, min: e.target.value })} 
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }} 
                    />
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>ĐẾN</div>
                    <input 
                        type="number" 
                        placeholder="Giá cao nhất (VNĐ)" 
                        value={priceRange.max} 
                        onChange={(e) => onPriceChange({ ...priceRange, max: e.target.value })} 
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }} 
                    />
                </div>
            </div>
        </aside>
    );
};

export default ProductFilter;
