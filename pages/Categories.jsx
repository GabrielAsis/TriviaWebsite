import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import useAxios from "../src/hooks/useAxios";
import toast from "react-hot-toast";


import { gsap } from "gsap";
import FadeInUp from '../src/components/animations/FadeUp';

import { categoryData } from '../src/constants';

import { triangles } from '../src/assets';


const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const spiralRef = useRef(null);

  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  useEffect(() => {
    if (spiralRef.current) {
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
          delay: 1,
          ease: 'circ.inOut',
          transformOrigin: '50% 50%',
          xPercent: -50,
          yPercent: -50,
        }
      )
      
      .to(spiralRef.current, {
        rotation: '+=360',
        duration: 30,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
        xPercent: -50,
        yPercent: -50,
      });
    }
  }, [response]);

  // Function to handle category selection
  const handleCategorySelect = (categoryId, categoryName) => {
    dispatch({
      type: 'CHANGE_CATEGORY',
      payload: { category: categoryId, categoryName }
    });

    dispatch({
      type: 'CHANGE_AMOUNT',
      payload: 15
    });

    navigate(`/questions?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`);
    toast.success(`Selected category: ${categoryName}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        <h3 className="ml-2">Loading Categories...</h3>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load categories. Please try again.");
    return (
      <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-off-white">
      {/* HERO SECTION */}
      <div className="w-full pt-40 pb-26 flex flex-col justify-center items-center bg-gradient-to-tl from-primary to-[#8F5BFF] text-white overflow-hidden relative">
        {/* SPIRAL IMAGE */}
        <div 
          ref={spiralRef} 
          className='z-10 w-[150%] md:w-[60%] h-auto absolute left-1/2 top-1/2'
          style={{ opacity: 0 }}
        >
          <img className='w-full h-auto' src={triangles} alt="Triangle background shape" />
        </div>

        <div className="container flex flex-col justify-center items-center z-20">
          <FadeInUp delay={0.8}>
            <h1 className="text-center">Pick Your Playground</h1>
            <p className="text-off-white/80 max-w-3xl text-center mt-4">
              From films to science, pick a topic that excites you and dive into a trivia challenge designed to sharpen your mind and boost your score.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className='container py-16'>
        {/* Categories Grid */}
        <FadeInUp delay={1.2} triggerStart='top 80%'>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {response?.trivia_categories?.map((category) => {
              const categoryInfo = categoryData[category.id] || { 
                name: category.name,
                image: generalKnowledge,
                description: "Test your knowledge in this category"
              };

              return (
                <div
                  key={category.id}
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
              );
            })}
          </div>
        </FadeInUp>
      </div>
    </div>
  );
};

export default Categories;