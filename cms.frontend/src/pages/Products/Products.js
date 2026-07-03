import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductFilter from '../../components/products/ProductFilter';
import ProductList from '../../components/products/ProductList';
import api from '../../services/api';

const Products = () => {
    const { categoryParam } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || '';

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    // Map URL param to category name
    useEffect(() => {
        if (!categoryParam) {
            setSelectedCategory('');
        } else if (categoryParam === 'male') {
            setSelectedCategory('Nước hoa nam');
        } else if (categoryParam === 'female') {
            setSelectedCategory('Nước hoa nữ');
        } else if (categoryParam === 'unisex') {
            setSelectedCategory('Nước Hoa Unisex');
        } else {
            setSelectedCategory(categoryParam); // Dùng tên danh mục động
        }
    }, [categoryParam]);

    // Fetch data
    useEffect(() => {
        setIsLoading(true);
        const endpoint = searchQuery 
            ? `/api/productapi/search?keyword=${encodeURIComponent(searchQuery)}`
            : '/api/productapi';
            
        api.get(endpoint)
            .then(res => {
                if (res.data && res.data.success) {
                    const data = res.data.data;
                    setAllProducts(data);
                    setFilteredProducts(data);
                    
                    // Extract unique categories
                    const cats = [...new Set(data.map(p => p.categoryName).filter(Boolean))];
                    setCategories(cats);
                }
            })
            .catch(err => console.error("Error fetching products:", err))
            .finally(() => setIsLoading(false));
    }, [searchQuery]);

    // Handle Filtering
    useEffect(() => {
        let result = [...allProducts];

        // Filter by category
        if (selectedCategory !== '') {
            result = result.filter(p => p.categoryName === selectedCategory);
        }

        // Filter by price
        if (priceRange.min !== '' || priceRange.max !== '') {
            result = result.filter(p => {
                const price = p.price || 0;
                const min = priceRange.min !== '' ? parseInt(priceRange.min) : 0;
                const max = priceRange.max !== '' ? parseInt(priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to page 1 when filter changes
    }, [selectedCategory, priceRange, allProducts]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll back to top of list
    };

    return (
        <div className="page-wrapper">
            <Header />
            
            <main className="products-page">
                {/* Page Header */}
                <section className="page-header bg-dark text-white text-center py-5" style={{ padding: '80px 0', background: '#111' }}>
                    <div className="container">
                        <h1 className="page-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', letterSpacing: '2px', marginBottom: '15px' }}>
                            Bộ Sưu Tập
                        </h1>
                        <p style={{ opacity: 0.8, fontWeight: 300, letterSpacing: '1px' }}>
                            Khám phá những hương thơm độc bản từ các thương hiệu hàng đầu
                        </p>
                    </div>
                </section>

                <section className="products-content container section">
                    <div className="products-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '50px' }}>
                        {/* Sidebar Filter */}
                        <ProductFilter 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                        />

                        {/* Main Product List */}
                        <div className="products-main">
                            <div className="products-top-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                                <span>Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm</span>
                                <div className="sort-by">
                                    <select style={{ padding: '8px 15px', border: '1px solid #ddd', background: 'transparent', outline: 'none' }}>
                                        <option value="newest">Mới nhất</option>
                                        <option value="price-asc">Giá: Thấp đến Cao</option>
                                        <option value="price-desc">Giá: Cao đến Thấp</option>
                                    </select>
                                </div>
                            </div>
                            
                            <ProductList products={currentProducts} isLoading={isLoading} />

                            {!isLoading && filteredProducts.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '50px 0', width: '100%' }}>
                                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="No products" style={{ width: '200px', opacity: 0.5, margin: '0 auto' }} />
                                    <h3 style={{ color: '#888', marginTop: '20px', fontSize: '1.2rem', fontWeight: '400' }}>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h3>
                                </div>
                            )}

                            {/* Pagination UI */}
                            {!isLoading && totalPages > 1 && (
                                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', gap: '10px' }}>
                                    <button 
                                        onClick={() => paginate(currentPage - 1)} 
                                        disabled={currentPage === 1}
                                        style={{ padding: '8px 16px', border: '1px solid #ddd', background: currentPage === 1 ? '#f5f5f5' : 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        &laquo; Trước
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => paginate(i + 1)}
                                            style={{ 
                                                padding: '8px 16px', 
                                                border: '1px solid #ddd', 
                                                background: currentPage === i + 1 ? '#111' : 'transparent', 
                                                color: currentPage === i + 1 ? '#fff' : '#333',
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button 
                                        onClick={() => paginate(currentPage + 1)} 
                                        disabled={currentPage === totalPages}
                                        style={{ padding: '8px 16px', border: '1px solid #ddd', background: currentPage === totalPages ? '#f5f5f5' : 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                                    >
                                        Sau &raquo;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Products;
