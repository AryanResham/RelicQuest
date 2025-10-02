"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Categories() {
  const categories = [
    { name: "Phones", icon: "📱", active: false },
    { name: "Computers", icon: "💻", active: false },
    { name: "SmartWatch", icon: "⌚", active: false },
    { name: "Camera", icon: "📷", active: true },
    { name: "HeadPhones", icon: "🎧", active: false },
    { name: "Gaming", icon: "🎮", active: false },
  ]

  return (
    <section className="container mx-auto px-4 py-16 border-b">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-5 h-10 bg-red-500 rounded"></div>
        <span className="text-red-500 font-semibold">Categories</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold">Browse By Category</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={`cursor-pointer transition-colors hover:bg-red-500 hover:text-white ${
              category.active ? "bg-red-500 text-white" : ""
            }`}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="text-4xl mb-4">{category.icon}</div>
              <span className="font-medium">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
