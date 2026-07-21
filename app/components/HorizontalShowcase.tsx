'use client'

import Image from 'next/image'
import { memo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface HorizontalShowcaseSlide {
  src: string
  alt: string
  title: string
  description: string
}

interface HorizontalShowcaseProps {
  slides: HorizontalShowcaseSlide[]
}

function HorizontalShowcase({ slides }: HorizontalShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track || slides.length < 2) return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()

    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        section.dataset.scrollAnimated = 'true'
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth)

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(distance(), 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            snap: {
              snapTo: 1 / (slides.length - 1),
              duration: { min: 0.12, max: 0.35 },
              delay: 0.06,
              ease: 'power1.inOut',
            },
          },
        })

        let refreshFrame = 0
        const refresh = () => {
          window.cancelAnimationFrame(refreshFrame)
          refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
        }
        const resizeObserver = new ResizeObserver(refresh)
        resizeObserver.observe(section)
        resizeObserver.observe(track)

        let disposed = false
        void document.fonts?.ready.then(() => {
          if (!disposed) refresh()
        })

        return () => {
          disposed = true
          resizeObserver.disconnect()
          window.cancelAnimationFrame(refreshFrame)
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(track, { clearProps: 'transform' })
          delete section.dataset.scrollAnimated
        }
      },
    )

    return () => media.revert()
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-label="Deca Pal product walkthrough"
      tabIndex={0}
      className="deca-horizontal-showcase relative min-h-[100dvh] bg-black text-white"
    >
      <div ref={trackRef} className="deca-horizontal-track" role="list">
        {slides.map((slide, index) => (
          <article
            key={slide.src}
            role="listitem"
            className="deca-horizontal-slide flex min-h-[100dvh] w-screen shrink-0 items-stretch"
          >
            <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-10">
              <span className="sr-only">Page {index + 1} of {slides.length}</span>
              <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[minmax(13rem,0.7fr)_minmax(0,2.3fr)] lg:gap-14 lg:py-10">
                <div className="max-w-sm self-end lg:self-center">
                  <h2 className="text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-400 sm:text-base">
                    {slide.description}
                  </p>
                </div>

                <div className="relative aspect-video w-full self-start overflow-hidden border border-white/20 bg-neutral-950 shadow-[0_32px_80px_rgba(0,0,0,0.55)] lg:self-center">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 92vw, (max-width: 1279px) 68vw, 940px"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default memo(HorizontalShowcase)
