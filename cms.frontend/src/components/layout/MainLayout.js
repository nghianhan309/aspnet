import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const location = useLocation();

    // Tự động cuộn lên đầu trang khi URL thay đổi
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="main-layout">
            <Header />
            <main className="content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
