import React from 'react';

const HeroBanner = () => {
    return (
        <section className="hero-banner">
            <div className="hero-content container">
                <h1 className="hero-title">Khám Phá Nghệ Thuật Mùi Hương</h1>
                <p className="hero-subtitle">Bộ sưu tập nước hoa chính hãng từ những thương hiệu hàng đầu thế giới.</p>
                <div className="hero-actions">
                    <button className="btn-primary">Mua Ngay</button>
                    <button className="btn-outline">Xem Bộ Sưu Tập</button>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
