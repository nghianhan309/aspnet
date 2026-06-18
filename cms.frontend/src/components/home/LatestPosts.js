import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LatestPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fallbackPosts = [
            {
                id: 1,
                title: 'Nghệ Thuật Chọn Nước Hoa Theo Mùa',
                imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&auto=format&fit=crop&q=80',
                categoryName: 'Kiến Thức',
                createdDate: '2026-06-10T10:00:00Z',
                content: 'Mỗi mùa mang một âm hưởng riêng, và nước hoa cũng vậy. Hãy cùng khám phá cách lựa chọn mùi hương phù hợp...'
            },
            {
                id: 2,
                title: 'Top 5 Hương Nước Hoa Nữ Được Yêu Thích Nhất',
                imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
                categoryName: 'Xu Hướng',
                createdDate: '2026-06-05T14:30:00Z',
                content: 'Những tầng hương nồng nàn, quyến rũ luôn làm say đắm phái đẹp. Điểm qua 5 kiệt tác mùi hương không thể bỏ lỡ...'
            },
            {
                id: 3,
                title: 'Hành Trình Tạo Ra Một Chai Nước Hoa Niche',
                imageUrl: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&auto=format&fit=crop&q=80',
                categoryName: 'Câu Chuyện',
                createdDate: '2026-06-01T09:15:00Z',
                content: 'Khám phá quá trình phức tạp và nghệ thuật đằng sau việc chế tác ra những chai nước hoa niche xa xỉ...'
            }
        ];

        api.get('/api/postapi/latest')
            .then(res => {
                if (res.data && res.data.success && res.data.data.length > 0) {
                    setPosts(res.data.data.slice(0, 3));
                } else {
                    setPosts(fallbackPosts);
                }
            })
            .catch(err => {
                console.error("Error fetching latest posts:", err);
                setPosts(fallbackPosts);
            });
    }, []);

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    return (
        <section className="latest-posts container section bg-light">
            <div className="section-header text-center" style={{marginBottom: '60px'}}>
                <h2 className="section-title">Tin tức &amp; Kiến thức nước hoa</h2>
                <p className="section-subtitle">Cập nhật những xu hướng và kiến thức mới nhất về thế giới mùi hương xa xỉ</p>
            </div>
            
            <div className="post-grid">
                {posts.map(post => (
                    <article key={post.id} className="post-card luxury-post-card">
                        <div className="post-image-container">
                            <img src={getImageUrl(post.imageUrl)} alt={post.title} className="post-image" />
                            <div className="post-category">{post.categoryName || 'Tin Tức'}</div>
                        </div>
                        <div className="post-content">
                            <span className="post-date">{formatDate(post.createdDate)}</span>
                            <h3 className="post-title"><a href={`/post/${post.id}`}>{post.title}</a></h3>
                            <p className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 120) + '...' }}></p>
                            <a href={`/post/${post.id}`} className="read-more luxury-link">Đọc tiếp &rarr;</a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default LatestPosts;
