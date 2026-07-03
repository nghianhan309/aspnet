import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';
import Swal from 'sweetalert2';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // BƯỚC 1: Gửi OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await api.post('/api/customer/forgot-password', { email });
            if (res.data.success) {
                setSuccess(res.data.message);
                setStep(2); // Chuyển sang bước nhập OTP
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // BƯỚC 2: Xác thực OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await api.post('/api/customer/verify-otp', { email, otpCode });
            if (res.data.success) {
                setSuccess(res.data.message);
                setStep(3); // Chuyển sang bước đổi mật khẩu
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
        } finally {
            setIsLoading(false);
        }
    };

    // BƯỚC 3: Đổi Mật Khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/api/customer/reset-password', { 
                email, 
                otpCode, 
                newPassword 
            });
            
            if (res.data.success) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
                    icon: 'success',
                    confirmButtonColor: '#10B981'
                });
                navigate('/login');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        
                        {/* ================= BƯỚC 1: NHẬP EMAIL ================= */}
                        {step === 1 && (
                            <>
                                <div className="auth-header">
                                    <h2>Quên mật khẩu?</h2>
                                    <p>Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
                                </div>
                                <form className="auth-form" onSubmit={handleSendOTP}>
                                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
                                    {success && <div className="success-message" style={{ color: '#10B981', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{success}</div>}
                                    
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
                                    
                                    <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                        {isLoading ? 'Đang xử lý...' : <>Gửi mã xác nhận <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ================= BƯỚC 2: NHẬP OTP ================= */}
                        {step === 2 && (
                            <>
                                <div className="auth-header">
                                    <h2>Xác thực OTP</h2>
                                    <p>Mã 6 số đã được gửi đến <strong>{email}</strong></p>
                                    <p style={{fontSize: '13px', color: '#888', marginTop: '5px'}}>
                                        (Ghi chú: Xem mã OTP ở cửa sổ Console log của Backend nhé!)
                                    </p>
                                </div>
                                <form className="auth-form" onSubmit={handleVerifyOTP}>
                                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
                                    {success && <div className="success-message" style={{ color: '#10B981', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{success}</div>}
                                    
                                    <div className="input-group-auth">
                                        <label>Mã OTP</label>
                                        <div className="input-wrapper-auth">
                                            <KeyRound className="input-icon-auth" size={18} />
                                            <input 
                                                type="text" 
                                                placeholder="Nhập mã 6 số" 
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                maxLength="6"
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                        {isLoading ? 'Đang xác thực...' : <>Xác thực <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ================= BƯỚC 3: ĐỔI MẬT KHẨU ================= */}
                        {step === 3 && (
                            <>
                                <div className="auth-header">
                                    <h2>Tạo mật khẩu mới</h2>
                                    <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
                                </div>
                                <form className="auth-form" onSubmit={handleResetPassword}>
                                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
                                    
                                    <div className="input-group-auth">
                                        <label>Mật khẩu mới</label>
                                        <div className="input-wrapper-auth">
                                            <Lock className="input-icon-auth" size={18} />
                                            <input 
                                                type="password" 
                                                placeholder="Nhập mật khẩu mới" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required 
                                                minLength="6"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-auth">
                                        <label>Xác nhận mật khẩu</label>
                                        <div className="input-wrapper-auth">
                                            <Lock className="input-icon-auth" size={18} />
                                            <input 
                                                type="password" 
                                                placeholder="Nhập lại mật khẩu mới" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required 
                                                minLength="6"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                        {isLoading ? 'Đang cập nhật...' : <>Cập nhật mật khẩu <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}
                        
                        <div className="auth-footer" style={{ marginTop: '20px' }}>
                            <p>
                                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <ArrowLeft size={16} /> Quay lại đăng nhập
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ForgotPassword;
