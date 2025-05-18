import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// shadcd UI
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
import FadeInUp from '../src/components/animations/FadeUp';
gsap.registerPlugin(useGSAP);

import { categoryData } from '../src/constants';
import useAxios from '../src/hooks/useAxios';

import { db } from '../src/Components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { logo } from '../src/assets';


export default function Home() {
  const spiralRef = useRef(null)
  const ctaSpiralTopLeftRef = useRef(null)
  const ctaSpiralBottomRightRef = useRef(null)

  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  const [users, setUsers] = useState([]);
  const [leaderLoading, setleaderLoading] = useState(true);

  // GSAP Animations
  useGSAP(() => {
    // HERO spiral animation (unchanged)
    if (spiralRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        spiralRef.current,
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
      );
      tl.to(spiralRef.current, {
        rotation: '+=360',
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
        xPercent: -50,
        yPercent: -50,
      });
    }

    // CTA spirals fade-in from left/right on scroll
    if (ctaSpiralTopLeftRef.current) {
      gsap.fromTo(
        ctaSpiralTopLeftRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "circ.inOut",
          delay: 1,
          scrollTrigger: {
            trigger: ctaSpiralTopLeftRef.current,
            start: "center 80%",
            toggleActions: "play none none none",
            onEnter: () => console.log('Spiral animation triggered!'),
          },
          onStart: () => console.log('Spiral animation started after delay!'),
          onComplete: () => {
            gsap.to(ctaSpiralTopLeftRef.current, {
              rotation: "+=360",
              duration: 40,
              repeat: -1,
              ease: "none",
              transformOrigin: "50% 50%",
            });
          }
        }
      );
    }
    if (ctaSpiralBottomRightRef.current) {
      gsap.fromTo(
        ctaSpiralBottomRightRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "circ.inOut",
          delay: 1,
          scrollTrigger: {
            trigger: ctaSpiralBottomRightRef.current,
            start: "center 80%",
            toggleActions: "play none none none",
          },
          onComplete: () => {
            gsap.to(ctaSpiralBottomRightRef.current, {
              rotation: "+=360",
              duration: 40,
              repeat: -1,
              ease: "none",
              transformOrigin: "50% 50%",
            });
          }
        }
      );
    }
  }, []);

   useEffect(() => {
    const fetchLeaderboard = async () => {
      setleaderLoading(true);
      try {
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, orderBy('points', 'desc'));
        const querySnapshot = await getDocs(q);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
      setleaderLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div className='py-32 sm:py-40 md:py-50 bg-gradient-to-br from-primary to-[#8F5BFF] text-white relative overflow-hidden z-30'>
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
        <FadeInUp className='container py-16 md:py-22 lg:py-28 space-y-3 md:space-y-6' triggerStart='center 50%'>
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
        </FadeInUp>
      </div>  

      {/* LEADERBOARDS SECTION */}
      <div className='bg-white my-20 md:my-26 lg:my-32 overflow-hidden'>
        <FadeInUp className='container flex flex-col lg:flex-row items-center gap-10 lg:gap-20' triggerStart='center 50%'>
          <div className='space-y-6 w-full flex-[1.25]'>
            <h2>Climb the Ranks & Prove Your Knowledge!</h2>
            <p className='text-gray'>Compete with friends and players worldwide in an exciting battle for the top spot! Showcase your knowledge, climb the leaderboard, and prove you're the best. Will you rise to the challenge and claim the number one position?</p>
            <Link to="/leaderboard">
                <Button>
                  View Leaderboards <ArrowRight strokeWidth={2}/>
                </Button>
            </Link> 
          </div>

          <div className='w-full flex-[1]' triggerStart='50% 50%'>
            <div className='bg-off-white p-6 md:p-8 rounded-xl space-y-4'>
              <h3 className='font-bold'>Leaderboard</h3>
              {leaderLoading ? (
                <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
                  <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <h3 className="ml-2">Loading questions...</h3>
                </div>
              ) : (
                <div className="w-full overflow-y-hidden overflow-x-auto custom-scrollbar">
                  <div className="min-w-[400px] flex flex-col">
                    {/* Header */}
                    <div className="flex py-2 border-b-3 border-primary">
                      <div className="w-[25%] text-left text-gray uppercase text-sm">Rank</div>
                      <div className="w-[60%] text-left text-gray uppercase text-sm">Name</div>
                      <div className="w-[15%] text-right text-gray uppercase text-sm">Points</div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                      {users.map((user, idx) => (
                        <div
                          key={user.id}
                          className="flex py-6 border-b-1 border-primary/40"
                        >
                          <p className="w-[25%] font-medium">{idx + 1}</p>
                          <p className="w-[60%] font-medium">{user.name || 'Unknown'}</p>
                          <p className="w-[15%] font-medium text-right text-primary">{user.points || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              )}
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* CTA SECTION */}
      <div className='bg-gradient-to-tl from-primary to-[#8F5BFF] relative overflow-hidden'>
        {/* Spiral Top Left */}
        <div ref={ctaSpiralTopLeftRef} className='z-10 w-[65vw] sm:w-[55vw] lg:w-[42vw] h-auto absolute -top-[20%] -left-[15%] sm:-top-[30%] sm:-left-[25%] lg:-top-70 lg:-left-70 pointer-events-none'>
          <img className='w-full h-auto' src="../src/assets/Jagged.png" alt="" />
        </div>
        {/* Spiral Bottom Right */}
        <div ref={ctaSpiralBottomRightRef} className='z-10 w-[65vw] sm:w-[55vw] lg:w-[42vw] h-auto absolute -bottom-[20%] -right-[15%] sm:-bottom-[30%] sm:-right-[25%] lg:-bottom-70 lg:-right-70 pointer-events-none'>
          <img className='w-full h-auto' src="../src/assets/Hedgehog.png" alt="" />
        </div>

        {/* CONTAINER */}
        <FadeInUp className='container py-16 md:py-22 lg:py-28 space-y-4 md:space-y-5 text-white text-center flex flex-col justify-center items-center relative z-20' triggerStart='20% 50%' stagger={0.5}>
          <img className='w-22' src={logo} alt="" />
          <h2>Think you got what it takes?</h2>
          <p className='text-off-white/80 max-w-4xl'>Dive into exciting trivia challenges, test your knowledge across different categories, and climb the leaderboard. Whether you’re here for fun or to prove you're the ultimate trivia master, there’s always a challenge waiting for you!</p>
          <Link to="/modes">
            <Button variant="white">
              Start Playing Now
              <ArrowRight strokeWidth={2}/>
            </Button>
          </Link>
        </FadeInUp>
      </div>
    </>
  )
}
