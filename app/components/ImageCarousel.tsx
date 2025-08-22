'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: { src: string; alt: string; title?: string }[]
  autoPlayInterval?: number
}

export default function ImageCarousel({ images, autoPlayInterval = 4000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Safety check for empty images array
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No images to display</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoPlayInterval, currentIndex, isPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsPlaying(true), 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 5000)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 5000)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Container */}
      <div className="relative aspect-video bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          priority
        />
        
        {/* Image title overlay */}
        {images[currentIndex].title && (
          <div className="absolute bottom-6 left-6">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
              <h3 className="text-white text-lg font-medium">{images[currentIndex].title}</h3>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 group"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 group"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Clean dot indicators */}
      <div className="flex justify-center space-x-3 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-black dark:bg-white scale-150'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-125'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}