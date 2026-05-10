import React from 'react';
import HeroSection from '../components/Homepage/HeroSection';
import HowItWorks from '../components/Homepage/HowItWorks';
import { TypeAnimation } from 'react-type-animation';
const HomePage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <HowItWorks />
    </div>
  );
};

export default HomePage;