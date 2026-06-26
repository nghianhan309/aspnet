import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="page-wrapper">
            <Header />
            <main className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div className="order-success-icon">✓</div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '20px' }}>
                    Đặt Hàng Thành Công!
                </h1>
                {orderId && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '10px' }}>
                        Mã đơn hàng của bạn: <strong style={{ color: 'var(--primary)' }}>#{orderId}</strong>
                    </p>
                )}
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
                    Cảm ơn bạn đã tin tưởng NEXUS FRAGRANCE. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>
                        Tiếp tục mua sắm
                    </Link>
                    <Link to="/" className="btn-outline-dark" style={{ display: 'inline-flex' }}>
                        Về trang chủ
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
