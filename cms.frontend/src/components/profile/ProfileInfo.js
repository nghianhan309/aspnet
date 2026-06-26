import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProfileInfo = ({ customerId, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        api.get(`/api/customer/${customerId}`)
            .then(res => {
                if (res.data && res.data.success) {
                    setFormData({
                        fullName: res.data.data.fullName || '',
                        email: res.data.data.email || '',
                        phone: res.data.data.phone || '',
                        address: res.data.data.address || ''
                    });
                }
            })
            .catch(err => console.error("Error fetching profile:", err))
            .finally(() => setIsLoading(false));
    }, [customerId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            const res = await api.put(`/api/customer/${customerId}`, {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            });
            if (res.data && res.data.success) {
                setMessage('Cập nhật thông tin thành công!');
                setIsSuccess(true);
                const currentCustomer = JSON.parse(localStorage.getItem('customer'));
                localStorage.setItem('customer', JSON.stringify({
                    ...currentCustomer,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address
                }));
                if (onSuccess) onSuccess(res.data.data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Có lỗi xảy ra khi cập nhật thông tin.');
            setIsSuccess(false);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải...</div>;

    return (
        <div className="profile-card">
            <h4 className="profile-title">Thông Tin Tài Khoản</h4>
            
            {message && (
                <div className={`alert-msg ${isSuccess ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email (Không thể thay đổi)</label>
                    <input type="email" className="form-input" value={formData.email} disabled />
                </div>
                <div className="form-group">
                    <label className="form-label">Họ và Tên</label>
                    <input type="text" className="form-input" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input type="text" className="form-input" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Địa chỉ</label>
                    <input type="text" className="form-input" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-save" disabled={isSaving}>
                    {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                </button>
            </form>
        </div>
    );
};

export default ProfileInfo;
