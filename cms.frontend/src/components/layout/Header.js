import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
    const [postCategories, setPostCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const { getCartCount } = useCart();

    useEffect(() => {
        const fetchPostCategories = async () => {
            try {
                const response = await api.get('/api/postapi/categories');
                if (response.data && response.data.success) {
                    setPostCategories(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh mục bài viết:', error);
            }
        };

        const fetchProductCategories = async () => {
            try {
                const response = await api.get('/api/category');
                if (response.data && response.data.success) {
                    setProductCategories(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh mục sản phẩm:', error);
            }
        };

        fetchPostCategories();
        fetchProductCategories();
    }, []);
    
    return (
        <header className="header">
            <div className="container header-inner">
                {/* Logo */}
                <div className="logo-container">
                    <Link to="/" className="logo">
                        <span className="logo-text">NEXUS<span className="logo-accent">FRAGRANCE</span></span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    
                    {/* Sản phẩm - Dropdown */}
                    <div 
                        className="nav-item-dropdown"
                        onMouseEnter={() => window.innerWidth > 768 && setIsDropdownOpen(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setIsDropdownOpen(false)}
                    >
                        <div 
                            className="nav-link" 
                            onClick={() => window.innerWidth <= 768 && setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Sản phẩm
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            {productCategories.map(category => (
                                <Link 
                                    key={category.id} 
                                    to={`/products/${category.name}`} 
                                    className="dropdown-item" 
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                            <Link to="/products" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Tất cả sản phẩm</Link>
                        </div>
                    </div>


                    {/* Bài Viết - Dropdown */}
                    <div 
                        className="nav-item-dropdown"
                        onMouseEnter={() => window.innerWidth > 768 && setIsPostDropdownOpen(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setIsPostDropdownOpen(false)}
                    >
                        <div 
                            className="nav-link" 
                            onClick={() => window.innerWidth <= 768 && setIsPostDropdownOpen(!isPostDropdownOpen)}
                        >
                            Bài viết
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isPostDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <div className={`dropdown-menu ${isPostDropdownOpen ? 'show' : ''}`}>
                            {postCategories.map(category => (
                                <Link 
                                    key={category.id}
                                    to={`/posts?category=${category.id}`} 
                                    className="dropdown-item" 
                                    onClick={() => setIsPostDropdownOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                            <Link to="/posts" className="dropdown-item" onClick={() => setIsPostDropdownOpen(false)}>Tất cả bài viết</Link>
                        </div>
                    </div>
                    <Link to="/contact" className="nav-link">Liên hệ</Link>
                </nav>

                {/* Actions */}
                <div className="header-actions">
                    <button className="action-btn">
                        <Search size={20} />
                    </button>
                    
                    {(() => {
                        const customerJson = localStorage.getItem('customer');
                        if (customerJson) {
                            try {
                                const customer = JSON.parse(customerJson);
                                return (
                                    <div className="user-dropdown" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <Link to="/profile" className="action-btn" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-main)'}}>
                                            <div style={{width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#111', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span style={{fontSize: '14px', fontWeight: '500'}} className="user-greeting">Chào, {customer.fullName}</span>
                                        </Link>
                                        <button 
                                            className="action-btn ms-2 text-danger" 
                                            title="Đăng xuất"
                                            onClick={() => {
                                                localStorage.removeItem('customer');
                                                window.location.reload();
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                        </button>
                                    </div>
                                );
                            } catch (e) {
                                // Ignore parse error
                            }
                        }
                        
                        return (
                            <Link to="/login" className="action-btn" title="Đăng nhập">
                                <User size={20} />
                            </Link>
                        );
                    })()}

                    <Link to="/cart" className="action-btn cart-btn">
                        <ShoppingBag size={20} />
                        <span className="cart-badge">{getCartCount()}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
