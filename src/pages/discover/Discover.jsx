import React from 'react'
import Header from '../../components/base/Header'
import HeroSection from '../../components/discover/Hero'
import TopUniversities from '../../components/discover/TopUniversities'
import FeaturedUniversities from '../../components/discover/FeaturedUniversities'
import MostPopular from '../../components/discover/MostPopular'
import SuggestedForYou from '../../components/discover/SuggestedForYou'
import CTASection from '../../components/discover/CTASection'
import Footer from '../../components/discover/Footer'


const Discover = () => {
  return (
<div className='bg-[#0B0C10] h-full w-full overflow-x-hidden'>
    <div className='max-w-7xl mx-auto bg-[#0B0C10] text-inter px-4 sm:px-6 lg:px-8'>

    
    <HeroSection />
    <SuggestedForYou />
    <FeaturedUniversities />
    <MostPopular />
    <CTASection />
    <Footer />
    </div>
</div>
  )
}

export default Discover
