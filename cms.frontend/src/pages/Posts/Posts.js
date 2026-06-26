import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    useEffect(() => {
        setIsLoading(true);
        api.get('/api/postapi')
            .then(res => {
                if (res.data && res.data.success) {
                    setPosts(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching posts:", err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (categoryId) {
            setFilteredPosts(posts.filter(p => p.categoryId && p.categoryId.toString() === categoryId));
        } else {
            setFilteredPosts(posts);
        }
        setCurrentPage(1);
    }, [posts, categoryId]);

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    // Helper to get image URL
    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    return (
        <div className="posts-page">
            <Header />
            
            <main className="main-content" style={{ backgroundColor: '#fdfdfd', minHeight: '80vh', padding: '60px 0' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h1 className="section-title" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#111' }}>Tạp Chí Mùi Hương</h1>
                        <p className="section-subtitle" style={{ fontSize: '1.1rem', color: '#666', marginTop: '10px' }}>Những câu chuyện và kiến thức thú vị về thế giới nước hoa</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <p>Đang tải bài viết...</p>
                        </div>
                    ) : (
                        <div className="post-grid">
                            {currentPosts.length > 0 ? (
                                currentPosts.map(post => (
                                    <article key={post.id} className="luxury-post-card">
                                        <div className="post-image-container">
                                            <img 
                                                src={getImageUrl(post.imageUrl)} 
                                                className="post-image" 
                                                alt={post.title} 
                                            />
                                            <div className="post-category">{post.categoryName || 'Tin Tức'}</div>
                                        </div>
                                        <div className="post-content">
                                            <span className="post-date">{formatDate(post.createdDate)}</span>
                                            <h3 className="post-title">
                                                <a href={`/post/${post.id}`}>{post.title}</a>
                                            </h3>
                                            <p className="post-excerpt">
                                                {post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : ''}
                                            </p>
                                            <a href={`/post/${post.id}`} className="luxury-link">Đọc Tiếp &rarr;</a>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="text-center py-5" style={{ gridColumn: '1 / -1' }}>
                                    <h4 className="text-muted">Chưa có bài viết nào trong danh mục này.</h4>
                                </div>
                            )}
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
            </main>

            <Footer />
        </div>
    );
};

export default Posts;
