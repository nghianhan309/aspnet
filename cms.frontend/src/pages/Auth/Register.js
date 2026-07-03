import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import MainLayout from '../../components/layout/MainLayout';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/api/customer/register', {
                fullName: name,
                email: email,
                password: password
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đăng ký thành công! Vui lòng đăng nhập.',
                    icon: 'success',
                    confirmButtonColor: '#10B981'
                });
                navigate('/login');
            } else {
                setError(response.data.message || "Đăng ký thất bại.");
            }
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
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
                            <h2>Tạo tài khoản mới</h2>
                            <p>Trở thành thành viên của NEXUS FRAGRANCE</p>
                        </div>
                        
                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
                            <div className="input-group-auth">
                                <label>Họ và tên</label>
                                <div className="input-wrapper-auth">
                                    <User className="input-icon-auth" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Nhập họ tên của bạn" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

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
                                <label>Mật khẩu</label>
                                <div className="input-wrapper-auth">
                                    <Lock className="input-icon-auth" size={18} />
                                    <input 
                                        type="password" 
                                        placeholder="Tạo mật khẩu" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-group-auth">
                                <label>Xác nhận mật khẩu</label>
                                <div className="input-wrapper-auth">
                                    <Lock className="input-icon-auth" size={18} />
                                    <input 
                                        type="password" 
                                        placeholder="Nhập lại mật khẩu" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : <>Đăng ký <ArrowRight size={18} /></>}
                            </button>
                        </form>
                        
                        <div className="auth-footer">
                            <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Register;
