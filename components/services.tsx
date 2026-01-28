'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Archive, Lock } from 'lucide-react'

const Services = () => {
  return (
    <div id="services" className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground text-xl">Comprehensive blockchain solutions for your business</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-yellow-500 dark:text-yellow-400 mb-4">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Crypto Trading</h3>
              <p className="text-muted-foreground">Advanced trading platform with real-time analytics and secure transactions.</p>
            </CardContent>
          </Card>

          <Card className="hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-yellow-500 dark:text-yellow-400 mb-4">
                <Archive className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Blockchain Consulting & Security</h3>
              <p className="text-muted-foreground">Providing strategic advisory, audits, and security solutions for blockchain implementations.</p>
            </CardContent>
          </Card>

          <Card className="hover:transform hover:scale-105 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-yellow-500 dark:text-yellow-400 mb-4">
                <Lock className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Organizational Development</h3>
              <p className="text-muted-foreground">Advanced security protocols and monitoring for your digital assets.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Services