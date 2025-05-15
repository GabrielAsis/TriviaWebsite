import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

import { ArrowRight } from "lucide-react"

import { modes } from "../src/constants"

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FadeInUp from '../src/Components/animations/FadeUp';
gsap.registerPlugin(useGSAP);

import { categoryData } from '../src/constants';
import useAxios from '../src/hooks/useAxios';


export default function Home() {
  const spiralRef = useRef(null)

  const { response, error, loading } = useAxios({ url: "/api_category.php" });


  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline()

    // Zoom + fade in while starting the spin
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
        delay: 1,
        ease: 'circ.inOut',
        transformOrigin: '50% 50%',
        xPercent: -50,
        yPercent: -50,
      }
    )
    
    tl.to(spiralRef.current, {
      rotation: '+=360',
      duration: 60,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
      xPercent: -50,
      yPercent: -50,
    })
    
  }, { scope: spiralRef })

  return (
    <>
      {/* HERO SECTION */}
      <div style={{
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }} className='py-32 sm:py-40 md:py-50 bg-gradient-to-br from-primary to-[#8F5BFF] text-white relative overflow-hidden z-30'>
        <div  className='flex flex-col justify-center items-center space-y-8 h-full'>
          {/* SPIRAL IMAGE */}
          <div ref={spiralRef} className='z-10 w-[150%] md:w-[110%] h-auto absolute left-1/2 top-1/2'><img className='w-full h-auto' src="../src/assets/Spiral Shape.png" alt="" /></div>


          <div className='z-20 max-w-3xl px-4 sm:px-6 lg:px-8'>
            <FadeInUp delay={0.5} className='space-y-6'>
              {/* HERO TEXT */} 
              <h1 className='text-center'>Your Daily Dose of Fun Facts & Brain-Teasing Trivia</h1>
              <h4 className='text-center text-off-white/80'>Welcome to Trivio—where trivia meets fun, and your knowledge takes center stage!</h4>

              {/* BUTTON */}
              <div className='z-20 flex justify-center'>
                <Link to="modes">
                  <Button variant='white'>Play Now <ArrowRight strokeWidth={2} /></Button>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* MODES */}
      <div className='relative z-50 container mt-[-6rem]'>
        <FadeInUp triggerStart='top 50%' className='grid grid-cols-1 md:grid-cols-3 space-y-4 md:space-x-2 lg:space-x-4'>
          {modes.map((mode, index) => (
            <Card key={`${mode.id}-${index}`} className='border-none justify-between md:min-h-full'>
              <CardHeader className='space-y-4'>
                <div><img src={mode.icon} className='w-16 h-16' /></div>
                <div className='space-y-3'>
                  <CardTitle><h3>{mode.title}</h3></CardTitle>
                  <CardDescription><p className='text-gray'>{mode.desc}</p></CardDescription>
                </div>
              </CardHeader>
              <CardFooter>
                <Link to={mode.url} state={{ mode: mode.id }}>
                  <Button variant='ghost2'>Play Now <ArrowRight strokeWidth={2} /></Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </FadeInUp>
      </div>

      {/* CATEGORIES SECTION*/}
      <div className='bg-off-white mt-20 md:mt-26 lg:mt-32 overflow-hidden'>
        <div className='container py-16 md:py-22 lg:py-28 space-y-3 md:space-y-6'>
          {/* HEADER */}
          <div className='flex flex-col md:flex-row items-start md:justify-between md:items-center'>
            <h2>Explore a World of Trivia Topics </h2>
            <Link to="categories" className='flex flex-row items-center gap-2 text-primary hover:underline'>
              See More <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </div>

          {/* CAROUSEL */}
          <div className='relative w-full'>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {response?.trivia_categories
                  ?.slice(0, 10) // Limit to first 8 categories
                  .map((category) => {
                    const categoryInfo = categoryData[category.id] || { 
                      name: category.name,
                      image: generalKnowledge,
                      description: "Test your knowledge in this category"
                    };

                  return (
                    <CarouselItem
                      key={category.id}
                      className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div
                        className="cursor-pointer overflow-hidden flex flex-col gap-4"
                        onClick={() => handleCategorySelect(category.id, categoryInfo.name)}
                      >
                        {/* IMAGE */}
                        <div className="aspect-video w-full overflow-hidden rounded-xl">
                          <img 
                            src={categoryInfo.image} 
                            alt={categoryInfo.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                          />
                        </div>

                        {/* DETAILS */}
                        <div className="flex flex-col">
                          <p className="text-sm text-primary">{categoryInfo.tag}</p>
                          <h4 className="font-medium">{categoryInfo.name}</h4>
                          <p className="text-sm text-gray">{categoryInfo.description}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="absolute inset-y-0 left-15 items-center z-10 hidden md:flex">
                <CarouselPrevious/>
              </div>

              <div className="absolute inset-y-0 right-15 items-center z-10 hidden md:flex">
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  )
}
