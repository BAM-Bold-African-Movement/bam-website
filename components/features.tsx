'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const features = [
    {
      title: "Educate and Empower",
      description: "African talent and startups by providing resources, mentorship, and opportunities to thrive in the tech ecosystem.",
      image: "/assests/img/moja1.jpg"
    },
    {
      title: "Hackthon",
      description: "We organize hackathons to solve real-world challenges and develop tech skills.",
      image: "/assests/img/mbili2.jpg"
    },
    {
      title: "Workshop",
      description: "We organize workshops to onboard more people to emerging technologies like web3.",
      image: "/assests/img/moja1.jpg"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [features.length])

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const handleImageError = (imageSrc: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Error loading image: ${imageSrc}`)
    setImageErrors(prev => ({
      ...prev,
      [imageSrc]: true
    }))
    e.currentTarget.src = '/assests/img/fallback-image.jpg'
  }

  return (
    <div id="features" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            The BAM Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Within the BAM Ecosystem, users can earn for both passive and active contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="hover:transform hover:scale-105 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="h-48 mb-6 flex items-center justify-center p-4">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => handleImageError(feature.image, e)}
                    style={{
                      opacity: imageErrors[feature.image] ? 0.5 : 1
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base mb-6 line-clamp-2">
                  {feature.description}
                </p>
                <Button 
                  onClick={() => window.open('https://a6mb8nr1tm7.typeform.com/to/jm0FBILA?typeform-source=joinbam.carrd.co', '_blank')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                >
                  JOIN NOW
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentSlide === index ? 'bg-emerald-600' : 'bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features