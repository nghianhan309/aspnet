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
                <ul className="filter-list">
                    <li className={priceRange === 'all' ? 'active' : ''}>
                        <button onClick={() => onPriceChange('all')}>Tất cả mức giá</button>
                    </li>
                    <li className={priceRange === 'under2m' ? 'active' : ''}>
                        <button onClick={() => onPriceChange('under2m')}>Dưới 2.000.000đ</button>
                    </li>
                    <li className={priceRange === '2m-5m' ? 'active' : ''}>
                        <button onClick={() => onPriceChange('2m-5m')}>2.000.000đ - 5.000.000đ</button>
                    </li>
                    <li className={priceRange === 'over5m' ? 'active' : ''}>
                        <button onClick={() => onPriceChange('over5m')}>Trên 5.000.000đ</button>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default ProductFilter;
