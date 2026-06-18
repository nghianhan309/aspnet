import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/customer/login', {
                email: email,
                password: password
            });

            if (response.data.success) {
                // Lưu thông tin user vào localStorage
                localStorage.setItem('customer', JSON.stringify(response.data.data));
                navigate('/');
                // Optional: reload trang để Header cập nhật UI
                window.location.reload();
            } else {
                setError(response.data.message || "Đăng nhập thất bại.");
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setError(err.response?.data?.message || "Có lỗi xảy ra khi kết nối đến server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h2>Chào mừng trở lại</h2>
                            <p>Đăng nhập vào tài khoản NEXUS FRAGRANCE của bạn</p>
                        </div>
                        
                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
                            <div className="input-group-auth">
                                <label>Email</label>
                                <div className="input-wrapper-auth">
                                    <Mail className="input-icon-auth" size={18} />
                                    <input 
                                        type="email" 
                                        placeholder="Nhập email của bạn" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="input-group-auth">
                                <div className="label-flex">
                                    <label>Mật khẩu</label>
                                    <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>
                                </div>
                                <div className="input-wrapper-auth">
                                    <Lock className="input-icon-auth" size={18} />
                                    <input 
                                        type="password" 
                                        placeholder="Nhập mật khẩu" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                {isLoading ? 'Đang đăng nhập...' : <>Đăng nhập <ArrowRight size={18} /></>}
                            </button>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Login;
