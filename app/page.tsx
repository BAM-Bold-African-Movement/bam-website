import Posts from '@/components/posts'
import RecentPosts from '@/components/recent-posts'
import WhoToFollow from '@/components/who-to-follow'
import RecommendedTopics from '@/components/recommended-topics'
import HeroSection from '@/components/hero'
import WhatIsBam from '@/components/what-is-bam'
import Features from '@/components/features'
import Services from '@/components/services'
import GlobalPlatform from '@/components/global-platform'
import InvestorLogos from '@/components/investor-logos'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* What is BAM Section */}
      <WhatIsBam />
      
      {/* Features Section */}
      <Features />
      
      {/* Services Section */}
      <Services />
      
      {/* Global Platform Section */}
      <GlobalPlatform />
      
      {/* Partners Section */}
      <InvestorLogos />
      
      {/* Main Blog Content Section */}
      <section className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='container'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Latest Posts
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400'>
              Discover insights about web development and progressive web apps
            </p>
          </div>
          
          <div className='flex flex-col gap-x-16 gap-y-6 xl:flex-row xl:items-start'>
            <main className='flex-1'>
              <Posts />
            </main>

            <aside className='flex w-full flex-col justify-between gap-6 pb-10 md:flex-row xl:sticky xl:top-[65px] xl:w-[350px] xl:flex-col'>
              <RecentPosts />
              <RecommendedTopics />
              <WhoToFollow />
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}