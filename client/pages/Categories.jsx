import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import useAxios from "../src/hooks/useAxios";
import toast from "react-hot-toast";

// Import GSAP
import { gsap } from "gsap";
import FadeInUp from '../src/Components/animations/FadeUp';

// Import category images
import {
  generalKnowledge,
  books,
  movies,
  music,
  theatre,
  tv,
  games,
  boardGames,
  science,
  tech,
  maths,
  myths,
  sports,
  world,
  history,
  politics,
  art,
  celebrity,
  animals,
  vehicle,
  comic,
  gadget,
  anime,
  cartoons,
  spiralShape
} from "../src/assets";

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ref for spiral animation
  const spiralRef = useRef(null);

  // Fetch categories from the API
  const { response, error, loading } = useAxios({ url: "/api_category.php" });

  // Use useEffect instead of useGSAP to ensure DOM is ready
  useEffect(() => {
    // Make sure the element exists before animating
    if (spiralRef.current) {
      // Clear any existing animations to prevent conflicts
      gsap.killTweensOf(spiralRef.current);
      
      // Create a timeline for sequencing animations
      const tl = gsap.timeline();
      
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
      
      // Add continuous spinning animation after the initial animation
      .to(spiralRef.current, {
        rotation: '+=360',
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
        xPercent: -50,
        yPercent: -50,
      });
    }
  }, [response]); // Run when response changes to ensure content is loaded
  
  // Categories data with images and descriptions
  const categoryData = {
    9: {
      name: "General Knowledge",
      image: generalKnowledge,
      description: "A bit of everything to test your all-around smarts."
    },
    10: {
      name: "Page Turner Trivia",
      image: books,
      description: "From classics to bestsellers, see how well you know your books."
    },
    11: {
      name: "Movie Mania",
      image: movies,
      description: "Challenge your knowledge of iconic scenes and silver screen moments."
    },
    12: {
      name: "Music Match",
      image: music,
      description: "From rock to pop, test your memory of music and melodies."
    },
    13: {
      name: "Musicals & Theatre",
      image: theatre,
      description: "Explore the world of Broadway and musical storytelling."
    },
    14: {
      name: "TV Time Trivia",
      image: tv,
      description: "How well do you remember your favorite shows?"
    },
    15: {
      name: "Gamer Knowledge",
      image: games,
      description: "Level up your score with video game trivia."
    },
    16: {
      name: "Board Game Quiz",
      image: boardGames,
      description: "From classics to strategy games, put your skills to the test."
    },
    17: {
      name: "Science & Nature",
      image: science,
      description: "Test your curiosity with facts about the natural world."
    },
    18: {
      name: "Tech Trivia",
      image: tech,
      description: "Explore computing concepts, history, and innovations."
    },
    19: {
      name: "Math Mind",
      image: maths,
      description: "Put your number sense and logic to the test."
    },
    20: {
      name: "Myths & Legends",
      image: myths,
      description: "Dive into ancient stories, gods, and myths."
    },
    21: {
      name: "Sports Quiz",
      image: sports,
      description: "From football to fencing—how much do you really know?"
    },
    22: {
      name: "World Explorer",
      image: world,
      description: "Name countries, landmarks, and global trivia."
    },
    23: {
      name: "History Hub",
      image: history,
      description: "Step back in time and see what you remember."
    },
    24: {
      name: "Politics Quiz",
      image: politics,
      description: "Test your knowledge of leaders, systems, and political events."
    },
    25: {
      name: "Art & Design",
      image: art,
      description: "From paintings to movements, explore the world of art."
    },
    26: {
      name: "Famous Faces",
      image: celebrity,
      description: "Recognize the names and stories behind the stars."
    },
    27: {
      name: "Animal Quiz",
      image: animals,
      description: "From land to sea, test your animal knowledge."
    },
    28: {
      name: "Vehicle Trivia",
      image: vehicle,
      description: "Planes, trains, and automobiles—quiz yourself on them all."
    },
    29: {
      name: "Comic Clash",
      image: comic,
      description: "From superheroes to strips, how well do you know comics?"
    },
    30: {
      name: "Gadget Geeks",
      image: gadget,
      description: "Tech toys and tools through the years."
    },
    31: {
      name: "Anime & Manga",
      image: anime,
      description: "From shonen to slice of life—how deep is your anime knowledge?"
    },
    32: {
      name: "Cartoons & Animation",
      image: cartoons,
      description: "Relive animated moments from childhood to today."
    }
  };

  // Handle category selection
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
      {/* Hero section with spiral animation */}
      <div className="w-full pt-40 pb-26 flex flex-col justify-center items-center bg-gradient-to-tl from-primary to-[#8F5BFF] text-white overflow-hidden relative">
        {/* SPIRAL IMAGE */}
        <div 
          ref={spiralRef} 
          className='z-10 w-[150%] md:w-[60%] h-auto absolute left-1/2 top-1/2'
          style={{ opacity: 0 }} // Set initial opacity in inline style to prevent flash
        >
          <img className='w-full h-auto' src="../src/assets/Triangle.png" alt="Triangle background shape" />
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
                image: generalKnowledge, // Fallback image
                description: "Test your knowledge in this category"
              };

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-primary overflow-hidden"
                  onClick={() => handleCategorySelect(category.id, categoryInfo.name)}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={categoryInfo.image} 
                      alt={categoryInfo.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{categoryInfo.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{categoryInfo.description}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category.id, categoryInfo.name);
                      }}
                    >
                      Select
                    </Button>
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