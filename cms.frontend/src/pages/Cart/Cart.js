import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x400?text=No+Image';
        if (url.startsWith('http')) return url;
        return `https://localhost:7226${url}`;
    };

    return (
        <div className="page-wrapper">
            <Header />
            
            <main className="cart-page section container">
                <h1 className="section-title text-center" style={{ marginBottom: '40px' }}>Giỏ Hàng Của Bạn</h1>
                
                {cartItems.length === 0 ? (
                    <div className="cart-empty text-center" style={{ padding: '60px 0' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px' }}>Hiện tại không có sản phẩm nào trong giỏ hàng.</p>
                        <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Tiếp tục mua sắm</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-container">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th colSpan="2">Sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="cart-item-row">
                                            <td className="cart-item-image-col">
                                                <Link to={`/product/${item.id}`}>
                                                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className="cart-item-image" />
                                                </Link>
                                            </td>
                                            <td className="cart-item-info-col">
                                                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                                                <span className="cart-item-category">{item.categoryName}</span>
                                            </td>
                                            <td className="cart-item-price-col">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </td>
                                            <td className="cart-item-quantity-col">
                                                <div className="quantity-selector cart-quantity">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <input type="number" value={item.quantity} readOnly />
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="cart-item-total-col">
                                                <strong style={{ color: 'var(--primary)' }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                                </strong>
                                            </td>
                                            <td className="cart-item-action-col">
                                                <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} title="Xóa sản phẩm">
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="cart-summary-container">
                            <div className="cart-summary-box">
                                <h3 className="summary-title">Tổng Đơn Hàng</h3>
                                <div className="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getCartTotal())}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí giao hàng:</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="summary-row summary-total">
                                    <span>Tổng cộng:</span>
                                    <span className="total-amount">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getCartTotal())}</span>
                                </div>
                                <Link to="/checkout" className="btn-primary checkout-btn" style={{ width: '100%', marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
                                    Tiến Hành Thanh Toán
                                </Link>
                                <Link to="/products" className="continue-shopping" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
