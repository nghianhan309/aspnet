import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="newsletter-section">
            <div className="container newsletter-inner">
                <div className="newsletter-content">
                    <h2 style={{fontFamily: 'var(--font-serif)', letterSpacing: '1px'}}>Đăng Ký Nhận Ưu Đãi Độc Quyền</h2>
                    <p style={{fontFamily: 'var(--font-sans)', fontWeight: '300', opacity: '0.8'}}>Trở thành thành viên VIP để nhận đặc quyền mua sắm và thông tin về các bộ sưu tập giới hạn.</p>
                </div>
                <div className="newsletter-form">
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={20} />
                        <input type="email" placeholder="Nhập email của bạn..." className="newsletter-input" />
                    </div>
                    <button className="btn-primary subscribe-btn">Đăng ký</button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
