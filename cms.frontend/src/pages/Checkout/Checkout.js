import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import Swal from 'sweetalert2';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/80x80?text=No+Image';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^[0-9]{10,11}$/.test(form.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
        if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Lấy thông tin khách hàng đã đăng nhập
        const customerJson = localStorage.getItem('customer');
        if (!customerJson) {
            Swal.fire({
                title: 'Yêu cầu đăng nhập',
                text: 'Vui lòng đăng nhập để đặt hàng!',
                icon: 'info',
                confirmButtonColor: '#111'
            });
            navigate('/login');
            return;
        }

        const customer = JSON.parse(customerJson);
        setIsLoading(true);

        try {
            const orderPayload = {
                customerId: customer.id,
                phoneNumber: form.phone,
                shippingAddress: form.address,
                notes: form.notes,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price
                }))
            };

            const res = await api.post('/api/orderapi', orderPayload);
            if (res.data && res.data.success) {
                Swal.fire({
                    title: 'Đặt hàng thành công!',
                    text: 'Cảm ơn bạn đã mua sắm tại NEXUS FRAGRANCE.',
                    icon: 'success',
                    confirmButtonColor: '#10B981'
                });
                clearCart();
                navigate('/');
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: res.data.message || 'Đặt hàng thất bại, vui lòng thử lại!',
                    icon: 'error',
                    confirmButtonColor: '#e74c3c'
                });
            }
        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra, vui lòng thử lại!',
                icon: 'error',
                confirmButtonColor: '#e74c3c'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="page-wrapper">
                <Header />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Giỏ hàng trống</h2>
                    <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Tiếp tục mua sắm</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Header />

            <main className="checkout-page section container">
                {/* Page Header */}
                <div className="breadcrumb" style={{ marginBottom: '30px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--text-main)' }}>Trang chủ</Link> /
                    <Link to="/cart" style={{ color: 'var(--text-main)', margin: '0 5px' }}>Giỏ hàng</Link> /
                    <span style={{ color: 'var(--primary)', marginLeft: '5px' }}>Thanh toán</span>
                </div>

                <h1 className="section-title text-center" style={{ marginBottom: '50px' }}>Thanh Toán</h1>

                <form onSubmit={handleSubmit} className="checkout-layout">
                    {/* Left: Shipping Info */}
                    <div className="checkout-form-section">
                        <div className="checkout-card">
                            <h3 className="checkout-section-title">Thông Tin Giao Hàng</h3>

                            <div className="form-group">
                                <label>Họ và tên *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Nhập họ và tên người nhận"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className={errors.fullName ? 'input-error' : ''}
                                />
                                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className={errors.phone ? 'input-error' : ''}
                                />
                                {errors.phone && <span className="error-msg">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ giao hàng *</label>
                                <textarea
                                    name="address"
                                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                    rows="3"
                                    value={form.address}
                                    onChange={handleChange}
                                    className={errors.address ? 'input-error' : ''}
                                />
                                {errors.address && <span className="error-msg">{errors.address}</span>}
                            </div>

                            <div className="form-group">
                                <label>Ghi chú thêm</label>
                                <textarea
                                    name="notes"
                                    placeholder="Yêu cầu đặc biệt, ghi chú cho shipper..."
                                    rows="2"
                                    value={form.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="checkout-card" style={{ marginTop: '20px' }}>
                            <h3 className="checkout-section-title">Phương Thức Thanh Toán</h3>
                            <div className="payment-option selected">
                                <span className="payment-radio">●</span>
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="checkout-summary-section">
                        <div className="checkout-card">
                            <h3 className="checkout-section-title">Đơn Hàng Của Bạn</h3>

                            <div className="checkout-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="checkout-item">
                                        <img src={getImageUrl(item.imageUrl)} alt={item.name} className="checkout-item-image" />
                                        <div className="checkout-item-info">
                                            <p className="checkout-item-name">{item.name}</p>
                                            <p className="checkout-item-meta">x{item.quantity}</p>
                                        </div>
                                        <div className="checkout-item-price">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-totals">
                                <div className="checkout-total-row">
                                    <span>Tạm tính</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getCartTotal())}</span>
                                </div>
                                <div className="checkout-total-row">
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#10B981' }}>Miễn phí</span>
                                </div>
                                <div className="checkout-total-row checkout-grand-total">
                                    <span>Tổng thanh toán</span>
                                    <span className="grand-total-amount">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getCartTotal())}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '16px', fontSize: '1rem' }}
                            >
                                {isLoading ? 'Đang xử lý...' : '✓  Xác Nhận Đặt Hàng'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '15px' }}>
                                Bằng cách đặt hàng, bạn đồng ý với chính sách của chúng tôi
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
