import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProfileInfo from '../../components/profile/ProfileInfo';
import OrderHistory from '../../components/profile/OrderHistory';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const customerJson = localStorage.getItem('customer');
        if (!customerJson) {
            navigate('/login');
            return;
        }
        try {
            setCustomer(JSON.parse(customerJson));
        } catch (e) {
            navigate('/login');
        }
    }, [navigate]);

    if (!customer) return null;

    return (
        <div className="profile-page">
            <Header />
            
            <main className="main-content" style={{ backgroundColor: '#fdfdfd', minHeight: '80vh' }}>
                <div className="profile-container">
                    
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="sidebar-header">
                            <div className="avatar-circle">
                                {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="sidebar-name">{customer.fullName}</div>
                            <div className="sidebar-email">{customer.email}</div>
                        </div>
                        <div className="sidebar-menu">
                            <button 
                                className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Thông tin tài khoản
                            </button>
                            <button 
                                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                Lịch sử mua hàng
                            </button>
                            <button 
                                className="menu-item danger"
                                onClick={() => {
                                    localStorage.removeItem('customer');
                                    navigate('/login');
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Đăng xuất
                            </button>
                        </div>
                    </aside>
                    
                    {/* Content Area */}
                    <div className="profile-content-area">
                        {activeTab === 'info' && <ProfileInfo customerId={customer.id} onSuccess={(data) => setCustomer(data)} />}
                        {activeTab === 'orders' && <OrderHistory customerId={customer.id} />}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
