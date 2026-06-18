import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                {/* Column 1: Logo & Tagline */}
                <div className="footer-section">
                    <h3 className="footer-title">NEXUS</h3>
                    <span className="footer-tagline">Fragrance House</span>
                    <p className="footer-text">
                        Khám phá thế giới mùi hương đẳng cấp dành riêng cho bạn. Chúng tôi cung cấp những chai nước hoa chính hãng 100% từ các thương hiệu hàng đầu thế giới.
                    </p>
                </div>

                {/* Column 2: Products */}
                <div className="footer-section">
                    <h4 className="footer-subtitle">Bộ Sưu Tập</h4>
                    <ul className="footer-links">
                        <li><a href="/products/male">Nước hoa Nam</a></li>
                        <li><a href="/products/female">Nước hoa Nữ</a></li>
                        <li><a href="/products/unisex">Nước hoa Unisex</a></li>
                        <li><a href="/products">Tất cả sản phẩm</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div className="footer-section">
                    <h4 className="footer-subtitle">Hỗ Trợ</h4>
                    <ul className="footer-links">
                        <li><a href="/faq">Câu hỏi thường gặp</a></li>
                        <li><a href="/shipping">Chính sách giao hàng</a></li>
                        <li><a href="/returns">Đổi trả &amp; Hoàn tiền</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Column 4: Connect */}
                <div className="footer-section">
                    <h4 className="footer-subtitle">Kết Nối</h4>
                    <ul className="footer-links">
                        <li><a href="#facebook">Facebook</a></li>
                        <li><a href="#instagram">Instagram</a></li>
                        <li><a href="#tiktok">TikTok</a></li>
                        <li><a href="#youtube">YouTube</a></li>
                    </ul>
                    <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '20px', fontWeight: '300'}}>
                        Hotline: <span style={{color: 'var(--accent)'}}>1900 xxxx</span>
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 Nexus Fragrance. All rights reserved. Made with ♥ in Vietnam.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
