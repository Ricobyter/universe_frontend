/**
 * Discover Page Component
 * 
 * Main landing/home page of the Universe platform.
 * Showcases various university collections and encourages exploration.
 * 
 * Features:
 * - Hero section with welcome and search
 * - Personalized suggestions for logged-in users
 * - Featured universities (admin-curated)
 * - Most popular universities by rating
 * - Call-to-action for user engagement
 * - Footer with links and information
 * 
 * This is a composition page that assembles multiple section components.
 * Each section fetches its own data independently.
 * 
 * Layout:
 * - Responsive max-width container (7xl)
 * - Centered content with proper padding
 * - Dark theme background (#0B0C10)
 */

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

    {/* Hero section with tagline and search bar */}
    <HeroSection />
    
    {/* Personalized university recommendations */}
    <SuggestedForYou />
    
    {/* Admin-curated featured universities */}
    <FeaturedUniversities />
    
    {/* Highest rated universities */}
    <MostPopular />
    
    {/* Call-to-action section */}
    <CTASection />
    
    {/* Footer with links */}
    <Footer />
    </div>
</div>
  )
}

export default Discover
