import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrderHistory = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        api.get(`/api/orderapi/customer/${customerId}`)
            .then(res => {
                if (res.data && res.data.success) {
                    setOrders(res.data.data);
                    if (res.data.data.length > 0) {
                        setExpandedOrder(res.data.data[0].id); // Expand first by default
                    }
                }
            })
            .catch(err => console.error("Error fetching orders:", err))
            .finally(() => setIsLoading(false));
    }, [customerId]);

    const getStatusTextAndClass = (status) => {
        switch (status) {
            case 0: return { text: 'Chờ duyệt', cls: 'status-pending' };
            case 1: return { text: 'Đang giao', cls: 'status-shipping' };
            case 2: return { text: 'Đã giao', cls: 'status-completed' };
            case 3: return { text: 'Đã hủy', cls: 'status-cancelled' };
            default: return { text: 'Không rõ', cls: '' };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    const toggleExpand = (id) => {
        if (expandedOrder === id) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(id);
        }
    };

    if (isLoading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải...</div>;

    if (orders.length === 0) {
        return (
            <div className="profile-card empty-state">
                <div className="empty-state-icon">📦</div>
                <h5 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Chưa có đơn hàng nào</h5>
                <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                <a href="/products" className="btn-outline" style={{borderColor: 'var(--primary)', color: 'var(--primary)'}}>Tiếp tục mua sắm</a>
            </div>
        );
    }

    return (
        <div className="profile-card">
            <h4 className="profile-title">Lịch Sử Mua Hàng</h4>
            
            <div className="order-list">
                {orders.map((order) => {
                    const statusInfo = getStatusTextAndClass(order.status);
                    const isExpanded = expandedOrder === order.id;

                    return (
                        <div className="order-item" key={order.id}>
                            <div className="order-header" onClick={() => toggleExpand(order.id)}>
                                <div className="order-id-date">
                                    <span className="order-id">Đơn hàng #{order.id}</span>
                                    <span className="order-date">{formatDate(order.orderDate)}</span>
                                </div>
                                <div className="order-price-status">
                                    <span className="order-price">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                                    <span className={`status-badge ${statusInfo.cls}`}>{statusInfo.text}</span>
                                </div>
                            </div>
                            
                            {isExpanded && (
                                <div className="order-details">
                                    <div className="shipping-info">
                                        <h6>Thông tin nhận hàng</h6>
                                        {order.notes && <p style={{color: 'var(--text-muted)'}}><strong>Chi tiết:</strong> {order.notes}</p>}
                                    </div>

                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th style={{textAlign: 'center'}}>Số lượng</th>
                                                <th style={{textAlign: 'right'}}>Đơn giá</th>
                                                <th style={{textAlign: 'right'}}>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items && order.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="prod-cell">
                                                            {item.productImage ? (
                                                                <img src={item.productImage.startsWith('http') ? item.productImage : `https://localhost:7226${item.productImage}`} alt={item.productName} className="prod-img" />
                                                            ) : (
                                                                <div className="prod-img" style={{background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                    <span style={{color: '#999', fontSize: '10px'}}>No IMG</span>
                                                                </div>
                                                            )}
                                                            <span className="prod-name">{item.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)'}}>x{item.quantity}</td>
                                                    <td style={{textAlign: 'right'}}>{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                                                    <td style={{textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)'}}>
                                                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderHistory;
