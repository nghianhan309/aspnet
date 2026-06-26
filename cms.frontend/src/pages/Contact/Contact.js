import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ với NEXUS FRAGRANCE. Chúng tôi sẽ phản hồi sớm nhất có thể!');
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="contact-page">
            <Header />
            
            <main className="main-content" style={{ backgroundColor: '#fdfdfd', paddingBottom: '80px' }}>
                {/* Hero Banner */}
                <section className="contact-hero">
                    <div className="contact-hero-content">
                        <h1 className="contact-hero-title">Liên Hệ Với Chúng Tôi</h1>
                        <p className="contact-hero-subtitle">Trải nghiệm dịch vụ chăm sóc khách hàng đẳng cấp từ NEXUS</p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="contact-container">
                    
                    {/* Contact Info */}
                    <div className="contact-info-col">
                        <h2 className="contact-info-title">Thông Tin Liên Hệ</h2>
                        <p className="contact-info-desc">
                            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về thế giới mùi hương. Hãy để NEXUS đồng hành cùng bạn tìm ra dấu ấn cá nhân.
                        </p>

                        <div className="info-item">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="info-text">
                                <h5>Boutique Chính</h5>
                                <p>123 Đường Sài Gòn, Quận 1, TP. Hồ Chí Minh</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div className="info-text">
                                <h5>Hotline Dịch Vụ</h5>
                                <p>+84 123 456 789 <br/><span style={{fontSize: '0.85em', opacity: 0.8}}>(Hoạt động từ 9:00 - 21:00)</span></p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="info-text">
                                <h5>Email Phản Hồi</h5>
                                <p>concierge@nexusfragrance.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-col">
                        <div className="contact-form-card">
                            <h3 className="contact-form-title">Gửi Tin Nhắn Cho NEXUS</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="contact-form-grid">
                                    <div className="contact-form-group">
                                        <label htmlFor="name">Họ và tên</label>
                                        <input type="text" className="contact-input" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="contact-form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="contact-input" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="contact-form-group form-full-width">
                                        <label htmlFor="phone">Số điện thoại</label>
                                        <input type="tel" className="contact-input" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    <div className="contact-form-group form-full-width">
                                        <label htmlFor="message">Nội dung lời nhắn</label>
                                        <textarea className="contact-textarea" id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                                    </div>
                                    <div className="contact-form-group form-full-width">
                                        <button type="submit" className="btn-submit-contact">
                                            GỬI THÔNG ĐIỆP
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
