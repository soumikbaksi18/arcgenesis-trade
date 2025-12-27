import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import './HeroSection.css'

function HeroSection() {
  useEffect(() => {
    // Initialize Unicorn Studio script
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false }
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js'
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          UnicornStudio.init()
          window.UnicornStudio.isInitialized = true
        }
      }
      ;(document.head || document.body).appendChild(script)
    }

    // Function to hide the badge
    const hideBadge = () => {
      // Wait for the embed to load, then hide the badge
      setTimeout(() => {
        const embed = document.querySelector('[data-us-project="uP9S6eG5wiWUjw9xqdCU"]')
        if (embed) {
          // Hide badge elements
          const badges = embed.querySelectorAll('a[href*="unicorn.studio"], [class*="badge"], [class*="attribution"]')
          badges.forEach(badge => {
            ;(badge as HTMLElement).style.display = 'none'
          })
          
          // Also check parent container
          const parent = embed.parentElement
          if (parent) {
            const parentBadges = parent.querySelectorAll('a[href*="unicorn.studio"], [class*="badge"], [class*="attribution"]')
            parentBadges.forEach(badge => {
              ;(badge as HTMLElement).style.display = 'none'
            })
          }
        }
      }, 1000)
    }

    // Run hideBadge after a delay to ensure embed is loaded
    const interval = setInterval(() => {
      hideBadge()
    }, 500)

    // Clean up interval after 5 seconds
    setTimeout(() => {
      clearInterval(interval)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="w-full min-h-screen m-0 p-0 flex justify-center items-center overflow-hidden bg-black border-none outline-none relative">
      <div 
        data-us-project="uP9S6eG5wiWUjw9xqdCU" 
        className="unicorn-studio-embed"
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-10 text-center pointer-events-none">
        <h1 className="font-roboto font-light text-white m-0 p-0 text-center tracking-tight text-7xl font-light leading-tight pointer-events-none">
          Build <span className="font-bodoni italic font-medium">strategies</span>. Automate <span className="font-bodoni italic font-medium">execution</span>. Stay in <span className="font-bodoni italic font-medium">charge</span>
        </h1>
        <button className="launch-app-button font-roboto font-medium text-black bg-white/90 backdrop-blur-md rounded-lg py-3 px-8 transition-colors duration-300 pointer-events-auto text-md tracking-wide hover:bg-white/95 z-[101] relative flex items-center gap-2 group">
          Launch app
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  )
}

export default HeroSection

