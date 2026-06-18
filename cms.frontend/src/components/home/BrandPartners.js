import React from 'react';

const BrandPartners = () => {
    // Nhân đôi danh sách để tạo hiệu ứng cuộn vô hạn mượt mà
    const brands = [
        "CHANEL", "DIOR", "TOM FORD", "YVES SAINT LAURENT", "GUCCI", "JO MALONE",
        "CHANEL", "DIOR", "TOM FORD", "YVES SAINT LAURENT", "GUCCI", "JO MALONE"
    ];

    return (
        <section className="brands-section section bg-light">
            <div className="container text-center">
                <h3 className="brands-title">Thương Hiệu Nổi Bật</h3>
                <div className="brands-marquee">
                    <div className="brands-track">
                        {brands.map((brand, idx) => (
                            <span key={idx} className="brand-name luxury-brand">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandPartners;
