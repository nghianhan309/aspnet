import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import HeroBanner from '../components/home/HeroBanner';
import CategoryShowcase from '../components/home/CategoryShowcase';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandPartners from '../components/home/BrandPartners';
import NewArrivals from '../components/home/NewArrivals';
import Newsletter from '../components/home/Newsletter';
import LatestPosts from '../components/home/LatestPosts';

const Home = () => {
    return (
        <MainLayout>
            <HeroBanner />
            <BrandPartners />
            <CategoryShowcase />
            <FeaturedProducts />
            <NewArrivals />
            <LatestPosts />
            <Newsletter />
        </MainLayout>
    );
};

export default Home;
