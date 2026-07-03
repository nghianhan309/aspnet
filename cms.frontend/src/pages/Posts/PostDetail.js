import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        api.get(`/api/postapi/${id}`)
            .then(res => {
                if (res.data && res.data.success) {
                    setPost(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching post detail:", err))
            .finally(() => setIsLoading(false));
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80';
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7226';
        return `${baseUrl}${url}`;
    };

    if (isLoading) {
        return (
            <div className="post-detail-page">
                <Header />
                <div className="loading-container">
                    <span>Đang tải bài viết...</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="post-detail-page">
                <Header />
                <div className="error-container">
                    <h2 className="error-title">Không tìm thấy bài viết</h2>
                    <p className="error-desc">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link to="/posts" className="luxury-btn">Quay lại danh sách</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="post-detail-page">
            <Header />
            
            <main className="main-content" style={{ backgroundColor: '#fdfdfd', paddingBottom: '80px' }}>
                {/* Hero Banner with Image */}
                <section className="post-hero" style={{ 
                    height: '50vh', 
                    backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.7)), url(${getImageUrl(post.imageUrl)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: '50px'
                }}>
                    <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <span style={{ 
                                display: 'inline-block',
                                background: '#fff', 
                                color: '#111',
                                padding: '6px 14px', 
                                fontSize: '0.8rem', 
                                letterSpacing: '1.5px', 
                                textTransform: 'uppercase',
                                marginBottom: '20px',
                                fontWeight: '600',
                                borderRadius: '30px'
                            }}>
                                {post.categoryName || 'Tạp chí'}
                            </span>
                            <h1 style={{ 
                                color: '#fff',
                                fontFamily: 'var(--font-serif)', 
                                fontSize: '3rem', 
                                lineHeight: '1.2', 
                                textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                                margin: 0
                            }}>
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="post-detail-wrapper">
                    <div className="post-meta-header">
                        <div className="post-author-info">
                            <div className="author-avatar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div className="author-details">
                                <span className="author-name">Biên tập viên NEXUS</span>
                                <span className="post-publish-date">{formatDate(post.createdDate)}</span>
                            </div>
                        </div>
                        <div className="post-share-actions">
                            <button className="share-btn" title="Chia sẻ Facebook">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </button>
                            <button className="share-btn" title="Copy Link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            </button>
                        </div>
                    </div>

                    <article className="post-body">
                        {/* Render HTML content if it contains tags, else use replace for newlines */}
                        {post.content && post.content.includes('<') ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: post.content ? post.content.replace(/\n/g, '<br/>') : '' }} />
                        )}
                    </article>

                    <div className="post-footer-actions">
                        <Link to="/posts" className="back-link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Quay lại tạp chí mùi hương
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PostDetail;
