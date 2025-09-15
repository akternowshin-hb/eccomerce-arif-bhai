'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  ArrowRight,
  Zap,
  Sparkles,
  Heart,
  Play,
  Pause,
  Maximize,
  X,
  Volume2,
  VolumeX
} from 'lucide-react'

interface BannerSlide {
  id: number
  title: string
  subtitle: string
  offer: string
  description: string
  buttonText: string
  buttonLink: string
  image: string
  themeColor: string
  bgPattern: string
}

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)

  // Single video for all slides
  const videoUrl = "https://files.catbox.moe/7bdkud.mp4"

  const slides: BannerSlide[] = [
    {
      id: 1,
      title: "SUMMER VIBES",
      subtitle: "New Collection 2025",
      offer: "50% OFF",
      description: "Discover our fresh summer collection with vibrant colors and comfortable fabrics perfect for the season.",
      buttonText: "Shop Collection",
      buttonLink: "/summer-collection",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
      themeColor: "#ff6b6b",
      bgPattern: "dots"
    },
    {
      id: 2,
      title: "PREMIUM STYLE",
      subtitle: "Luxury Fashion",
      offer: "EXCLUSIVE",
      description: "Elevate your wardrobe with our premium collection featuring high-quality materials and sophisticated designs.",
      buttonText: "Explore Premium",
      buttonLink: "/premium",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop",
      themeColor: "#4ecdc4",
      bgPattern: "waves"
    },
    {
      id: 3,
      title: "MEGA SALE",
      subtitle: "Limited Time Only",
      offer: "UP TO 70%",
      description: "Don't miss out! Huge discounts on thousands of items. Shop now before these amazing deals disappear.",
      buttonText: "Shop Sale",
      buttonLink: "/sale",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=800&fit=crop",
      themeColor: "#45b7d1",
      bgPattern: "geometric"
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      // Video continues playing - no interruption
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    // Video state unchanged
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    // Video state unchanged
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    // Video state unchanged
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
    if (fullscreenVideoRef.current) {
      // Sync the fullscreen video with current video time
      if (videoRef.current) {
        fullscreenVideoRef.current.currentTime = videoRef.current.currentTime
      }
      fullscreenVideoRef.current.play()
    }
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
    // Sync back to small video
    if (videoRef.current && fullscreenVideoRef.current) {
      videoRef.current.currentTime = fullscreenVideoRef.current.currentTime
      if (!fullscreenVideoRef.current.paused && isVideoPlaying) {
        videoRef.current.play()
      }
    }
  }

  const currentSlideData = slides[currentSlide]

  const getPatternSVG = (pattern: string, color: string) => {
    switch (pattern) {
      case 'dots':
        return `data:image/svg+xml,${encodeURIComponent(`
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="4" fill="${color}" opacity="0.1"/>
            <circle cx="10" cy="10" r="2" fill="${color}" opacity="0.15"/>
            <circle cx="50" cy="50" r="3" fill="${color}" opacity="0.12"/>
          </svg>
        `)}`
      case 'waves':
        return `data:image/svg+xml,${encodeURIComponent(`
          <svg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" fill="${color}" opacity="0.08"/>
          </svg>
        `)}`
      case 'geometric':
        return `data:image/svg+xml,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="20" height="20" fill="${color}" opacity="0.05"/>
            <rect x="20" y="20" width="20" height="20" fill="${color}" opacity="0.1"/>
          </svg>
        `)}`
      default:
        return ''
    }
  }

  return (
    <>
      <div className="relative w-full h-[700px] overflow-hidden bg-gray-50">
        {/* Background Image */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${currentSlideData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("${getPatternSVG(currentSlideData.bgPattern, currentSlideData.themeColor)}")`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="space-y-8">
                {/* Offer Badge */}
                <div 
                  className="inline-flex items-center px-8 py-4 rounded-full text-white font-bold text-xl mb-6 animate-bounce"
                  style={{
                    backgroundColor: currentSlideData.themeColor,
                    boxShadow: `0 15px 40px ${currentSlideData.themeColor}40`
                  }}
                >
                  <Zap className="w-6 h-6 mr-3" />
                  {currentSlideData.offer}
                  <Sparkles className="w-6 h-6 ml-3" />
                </div>

                {/* Subtitle */}
                <p className="text-2xl text-gray-200 mb-6 font-medium">
                  {currentSlideData.subtitle}
                </p>

                {/* Main Title */}
                <h1 
                  className="text-5xl md:text-6xl font-black mb-8 leading-none"
                  style={{
                    color: currentSlideData.themeColor,
                    textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                    WebkitTextStroke: '2px rgba(255,255,255,0.2)'
                  }}
                >
                  {currentSlideData.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-100 mb-10 leading-relaxed">
                  {currentSlideData.description}
                </p>

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  

                  {/* Stats */}
                  <div className="flex items-center space-x-8 text-white">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-6 h-6" style={{ color: currentSlideData.themeColor }} />
                      <span className="font-semibold text-lg">50K+ Loves</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 font-semibold text-lg">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Large Video Player - Visible on All Screens */}
              <div className="flex justify-center md:justify-end order-first md:order-last">
                <div 
                  className="relative w-full max-w-sm md:max-w-lg h-64 md:h-80 lg:h-96 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:scale-105"
                  onClick={openFullscreen}
                  style={{
                    boxShadow: `0 20px 60px ${currentSlideData.themeColor}30`,
                    border: `2px md:border-3 solid ${currentSlideData.themeColor}40`
                  }}
                >
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    autoPlay
                    poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                  />
                  
                  {/* Video Overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${currentSlideData.themeColor}15, transparent)`
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-300" />
                  
                  {/* Video Controls - Only show on hover/touch */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVideoPlay()
                        }}
                        className="w-12 h-12 md:w-16 md:h-16 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
                        style={{
                          boxShadow: `0 8px 25px ${currentSlideData.themeColor}40`
                        }}
                      >
                        {isVideoPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8" /> : <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMute()
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Fullscreen Icon */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div 
                      className="w-8 h-8 md:w-12 md:h-12 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center text-white"
                      style={{
                        boxShadow: `0 5px 15px ${currentSlideData.themeColor}40`
                      }}
                    >
                      <Maximize className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                  </div>

                  {/* Video Label */}
                  {/* <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
                    <div 
                      className="px-3 py-2 md:px-6 md:py-3 rounded-full text-white text-sm md:text-lg font-bold backdrop-blur-lg"
                      style={{ 
                        backgroundColor: `${currentSlideData.themeColor}90`,
                        boxShadow: `0 5px 20px ${currentSlideData.themeColor}40`
                      }}
                    >
                      🎥 Collection Story
                    </div>
                  </div> */}

                  {/* Decorative border animation */}
                  <div 
                    className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-50"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${currentSlideData.themeColor}40, transparent)`,
                      animation: 'borderRotate 3s linear infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-20 right-20 w-24 h-24 rounded-full animate-float opacity-15"
            style={{ 
              backgroundColor: currentSlideData.themeColor,
              animationDelay: '0s'
            }}
          />
          <div 
            className="absolute top-1/3 right-12 w-16 h-16 rotate-45 animate-float opacity-10"
            style={{ 
              backgroundColor: currentSlideData.themeColor,
              animationDelay: '1s'
            }}
          />
          <div 
            className="absolute bottom-1/4 right-24 w-20 h-20 rounded-full animate-float opacity-20"
            style={{ 
              backgroundColor: currentSlideData.themeColor,
              animationDelay: '2s'
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 z-30"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 z-30"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative w-4 h-4 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === currentSlide ? currentSlideData.themeColor : 'rgba(255,255,255,0.4)',
                transform: index === currentSlide ? 'scale(1.5)' : 'scale(1)',
                boxShadow: index === currentSlide ? `0 0 25px ${currentSlideData.themeColor}80` : 'none'
              }}
            />
          ))}
        </div>


      </div>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <video
            ref={fullscreenVideoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted={isMuted}
            loop
          />
          
          <button
            onClick={closeFullscreen}
            className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-25px) rotate(180deg); 
          }
        }
        
        @keyframes borderRotate {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

export default Banner