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

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoPlayInterval, isPlaying])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false)
    }
  }, [])

  // Safety check for empty images array
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
          <p className="text-neutral-600 dark:text-neutral-400">No images to display</p>
        </div>
      </div>
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setIsPlaying(false)
  }

  return (
    <section aria-label="Deca Pal feature screenshots" aria-roledescription="carousel" className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Container */}
      <div className="relative aspect-video bg-neutral-50 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-xl" role="group" aria-roledescription="slide" aria-label={`${currentIndex + 1} of ${images.length}`}>
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
          <div className="absolute bottom-6 left-6" aria-live="polite">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
              <h3 className="text-white text-lg font-medium">{images[currentIndex].title}</h3>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 group"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 group"
          aria-label="Next image"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Clean dot indicators */}
      <div className="flex flex-wrap items-center justify-center mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          >
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${index === currentIndex ? 'bg-black dark:bg-white' : 'bg-neutral-400 dark:bg-neutral-500'}`} />
          </button>
        ))}
        <button type="button" onClick={() => setIsPlaying(value => !value)} className="min-h-11 px-3 text-sm underline underline-offset-4">
          {isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        </button>
      </div>
    </section>
  )
}
