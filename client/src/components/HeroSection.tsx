"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="max-w-md">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">📱</span>
                </div>
                <span className="text-sm">Collectible Series</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Up to 10%
                <br />
                off Voucher
              </h1>
              <Button className="bg-white text-black hover:bg-gray-100">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-96 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Featured Collectible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 