'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const WhatIsBam = () => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Error loading image:', e)
    setImageError(true)
    e.currentTarget.src = '/assests/img/moja1.jpg'
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] w-full">
            <div className="absolute inset-0 rounded-2xl border overflow-hidden">
              {!imageError ? (
                <img 
                  src="/assests/img/moja1.jpg"
                  alt="What is BAM"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Image not found</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              What is BAM?
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              We are committed to building a diverse and collaborative community where everyone has a chance to succeed. and To catalyze transformation and drive impactful innovation in Africa's tech landscape.
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              We are dedicated to fostering a diverse and collaborative community that empowers individuals to succeed while driving transformative and impactful innovation in Africa's tech landscape.
            </p>
            <Button 
              onClick={() => window.open('https://a6mb8nr1tm7.typeform.com/to/jm0FBILA?typeform-source=joinbam.carrd.co', '_blank')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              size="lg"
            >
              JOIN NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatIsBam