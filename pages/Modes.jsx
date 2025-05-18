import React, { useEffect, useRef, useState } from 'react'

import { modes } from "../src/constants"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

import FadeInUp from '../src/components/animations/FadeUp';
import { gsap } from "gsap";
import { Link } from 'react-router';


const Modes = () => {
  const [glow, setGlow] = useState({ x: 50, y: 50, index: null });

  const spiralRef = useRef(null);

  useEffect(() => {
    gsap.killTweensOf(spiralRef.current);
    const tl = gsap.timeline();
    tl.fromTo(spiralRef.current,
      {
        scale: 0,
        opacity: 0,
        rotation: 0,
        xPercent: -50,
        yPercent: -50,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 45,
        duration: 2,
        delay: 0.5,
        ease: 'circ.inOut',
        transformOrigin: '50% 50%',
        xPercent: -50,
        yPercent: -50,
      }
    )

    tl.to(spiralRef.current, {
      rotation: '-=360',  
      duration: 40,
      repeat: -1,
      ease: 'none',
    })
  }, []);

   // Handler for mouse move on card
  const handleMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y, index: idx });
  };
  
  const handleMouseLeave = () => {
    setGlow({ x: 50, y: 50, index: null });
  };

  return (
    <>
      <div className='relative overflow-hidden pt-32 pb-20 md:py-0 md:h-screen w-full flex justify-center items-center bg-gradient-to-tr from-[#8F5BFF] to-primary'>
        <div 
          ref={spiralRef} 
          className='z-10 w-[100%] md:w-[80%] h-auto absolute left-1/2 top-1/2'
        >
          <img className='w-full h-auto' src="../src/assets/Fan Blades.png" alt=" " />
        </div>

      <div className='relative container z-20 overflow-hidden'>
        <FadeInUp triggerStart='top 100%' className='flex flex-col md:flex-row items-center justify-center gap-10 overflow-hidden'>
          {modes.map((mode, index) => (
            <Link   
              key={`${mode.id}-${index}`} 
              to={mode.url} 
              state={{ mode: mode.id }}   
              className="w-full overflow-hidden rounded-xl flex justify-center items-center"
              tabIndex={-1}
              onMouseMove={e => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
            >
                {/* Glow effect */}
                {glow.index === index && (
                  <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                    style={{
                      opacity: 0.7,
                      background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(180,120,255,0.6) 0%, transparent 60%)`,
                      zIndex: 1,
                    }}
                  />
                )}
                <Card className='relative z-10 w-full max-w-[360px] md:max-w-none p-0 aspect-square border-1 boder-white/80 text-white justify-center items-center md:min-h-full bg-white/10 backdrop-blur-sm shadow-none cursor-pointer transition overflow-hiddem'>
                  <CardHeader className='space-y-4 w-full flex flex-col justify-center items-center'>
                    <div><img src={mode.whiteIcon} className=' sm:h-18 sm:w-18 lg:w-40 lg:h-40' /></div>
                    <div className='space-y-3'>
                      <CardTitle><h3 className='text-center'>{mode.title}</h3></CardTitle>
                    </div>
                  </CardHeader>
                </Card>
            </Link>
          ))}
        </FadeInUp>
      </div>
      </div>
    </>
  )
}

export default Modes