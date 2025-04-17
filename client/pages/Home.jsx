import { useRef } from 'react'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FadeInUp from '../src/Components/animations/FadeUp';

gsap.registerPlugin(useGSAP);

export default function Home() {
  // Ref Variables
  const spiralRef = useRef(null)

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline()

    // Zoom + fade in while starting the spin
    tl.fromTo(spiralRef.current,
      {
        scale: 0,
        opacity: 0,
        rotation: 0,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 45,
        duration: 2 ,
        delay: 1,
        ease: 'circ.inOut',
        transformOrigin: '50% 50%',
      }
    )

    // Continue spinning infinitely from current state
    tl.to(spiralRef.current,
      {
        rotation: '+=360',
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      }
    )
  }, { scope: spiralRef })
  
  return (
    <>
      {/* HERO SECTION */}
      <div style={{
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }} className='py-32 sm:py-40 md:py-50 bg-gradient-to-br from-primary to-[#8F5BFF] text-white relative overflow-hidden'>
        <div  className='flex flex-col justify-center items-center space-y-8 h-full'>
          {/* SPIRAL IMAGE */}
          <div ref={spiralRef} className='z-10 w-[150%] md:w-[110%] h-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2'><img className='w-full h-auto' src="../public/Assets/Spiral Shape.png" alt="" /></div>

          <div className='z-20 max-w-3xl px-4 sm:px-6 lg:px-8'>
            <FadeInUp delay={0.5} className='space-y-6'>
              {/* HERO TEXT */} 
              <h1 className='text-center'>Your Daily Dose of Fun Facts & Brain-Teasing Trivia</h1>
              <h4 className='text-center text-off-white/80'>Welcome to Trivio—where trivia meets fun, and your knowledge takes center stage!</h4>

              {/* BUTTON */}
              <div className='z-20 flex justify-center'>
                <Button variant='white'>Play Now <ArrowRight strokeWidth={2} /></Button>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

    </>
  )
}
