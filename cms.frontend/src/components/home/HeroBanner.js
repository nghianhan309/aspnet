import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const HeroBanner = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get('/api/postapi')
            .then(res => {
                if (res.data && res.data.success && res.data.data.length > 0) {
                    // Lấy tối đa 3 bài viết mới nhất
                    setFeaturedPosts(res.data.data.slice(0, 3));
                }
            })
            .catch(err => console.error("Error fetching hero posts:", err));
    }, []);

    useEffect(() => {
        if (featuredPosts.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
        }, 5000); // 5 giây đổi slide
        
        return () => clearInterval(interval);
    }, [featuredPosts.length]);

    const getImageUrl = (url) => {
        if (!url) return '/hero-banner.png'; // Fallback
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredPosts.length) % featuredPosts.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const currentPost = featuredPosts[currentIndex];
    const backgroundUrl = currentPost ? getImageUrl(currentPost.imageUrl) : '/hero-banner.png';
    const title = currentPost ? currentPost.title : 'Khám Phá Nghệ Thuật Mùi Hương';
    
    // Xóa thẻ HTML khỏi nội dung bài viết và cắt ngắn gọn
    const cleanContent = currentPost && currentPost.content ? currentPost.content.replace(/<[^>]*>?/gm, '') : '';
    const subtitle = currentPost ? (cleanContent.length > 150 ? cleanContent.substring(0, 150) + '...' : cleanContent) : 'Bộ sưu tập nước hoa chính hãng từ những thương hiệu hàng đầu thế giới.';

    return (
        <section className="hero-section" style={{ padding: '0', position: 'relative', overflow: 'hidden' }}>
            {/* Banner Content */}
            <div 
                className="hero-banner-inner" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.8)), url('${backgroundUrl}')`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '650px',
                    borderTop: '3px solid rgba(212, 175, 55, 0.5)', 
                    borderBottom: '3px solid rgba(212, 175, 55, 0.5)', 
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    transition: 'background-image 0.8s ease-in-out' // Hiệu ứng chuyển mượt
                }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                    <div className="hero-content" style={{ animation: 'fadeIn 1s ease-in-out' }} key={currentIndex}>
                        <h1 className="hero-title">{title}</h1>
                        <p className="hero-subtitle">{subtitle}</p>
                        <div className="hero-actions">
                            {currentPost ? (
                                <Link to={`/post/${currentPost.id}`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Đọc Tiếp Câu Chuyện</Link>
                            ) : (
                                <button className="btn-primary">Khám Phá Ngay</button>
                            )}
                            <Link to="/products" className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>Xem Bộ Sưu Tập</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Controls */}
            {featuredPosts.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button 
                        onClick={prevSlide}
                        style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                        &#10094;
                    </button>
                    
                    {/* Right Arrow */}
                    <button 
                        onClick={nextSlide}
                        style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '24px', cursor: 'pointer', zIndex: 10, transition: '0.3s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                        &#10095;
                    </button>

                    {/* Dots */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
                        {featuredPosts.map((_, index) => (
                            <span 
                                key={index} 
                                onClick={() => goToSlide(index)}
                                style={{
                                    height: '12px',
                                    width: '12px',
                                    backgroundColor: currentIndex === index ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            ></span>
                        ))}
                    </div>
                </>
            )}

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </section>
    );
};

export default HeroBanner;
