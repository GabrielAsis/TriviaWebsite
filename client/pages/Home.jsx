import React from 'react'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div className='py-50 bg-primary text-white'>
        <div className='container flex flex-col justify-center items-center space-y-8 h-full relative'>
          {/* GRADIENT BLUR */}
          <div className='z-10 w-[120%] h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><img src="../public/Assets/Acceent Blur.png" alt="" /></div>

          {/* HERO TEXT */}
          <div className='space-y-4 z-20'>
            <h1 className='text-center'>Your Daily Dose of Fun Facts & Brain-Teasing Trivia</h1>
            <p className='text-center text-off-white/80 text-xl'>Welcome to Trivio—where trivia meets fun, and your knowledge takes center stage!</p>
          </div>
          <div className='z-20'>
            <Button>Play Now <ArrowRight strokeWidth={2} /></Button>
          </div>
        </div>
      </div>

      
    </>
  )
}
