  import React, { useEffect, useRef, useState } from 'react';
  import { db } from '../src/components/firebase';
  import { collection, getDocs, query, orderBy } from 'firebase/firestore';

  // animation imports
  import FadeInUp from '../src/components/animations/FadeUp';
  import { gsap } from "gsap";
  import useAxios from '../src/hooks/useAxios';

  // assets imports 
  import { circleInception, roundedStar } from "../src/assets"

  const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const spiralRef1 = useRef(null);
    const spiralRef2 = useRef(null);

    useEffect(() => {
      if (spiralRef1.current) {
        gsap.killTweensOf(spiralRef1.current);
        const tl = gsap.timeline();
        tl.fromTo(spiralRef1.current, { scale: 0, opacity: 0, rotation: 0, xPercent: -50, yPercent: -50 },
          { scale: 1, opacity: 1, rotation: 45, duration: 2, delay: 1, ease: 'circ.inOut', transformOrigin: '50% 50%', xPercent: -50, yPercent: -50 }
        ).to(spiralRef1.current, {
          rotation: '+=360',
          duration: 30,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
          xPercent: -50,
          yPercent: -50,
        });
      }
      if (spiralRef2.current) {
        gsap.killTweensOf(spiralRef2.current);
        const tl2 = gsap.timeline();
        tl2.fromTo(spiralRef2.current, { scale: 0, opacity: 0, rotation: 0, xPercent: -50, yPercent: -50 },
          { scale: 1, opacity: 1, rotation: 45, duration: 2, delay: 1, ease: 'circ.inOut', transformOrigin: '50% 50%', xPercent: -50, yPercent: -50 }
        ).to(spiralRef2.current, {
          rotation: '+=360',
          duration: 30,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
          xPercent: -50,
          yPercent: -50,
        });
      }
    }, []);
    
    useEffect(() => {
      const fetchLeaderboard = async () => {
        setLoading(true);
        try {
          const usersRef = collection(db, 'Users');
          const q = query(usersRef, orderBy('points', 'desc'));
          const querySnapshot = await getDocs(q);
          const usersList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Only include users with points > 0
            if ((data.points ?? 0) > 0) {
              usersList.push({ id: doc.id, ...data });
            }
          });
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        }
        setLoading(false);
      };

      fetchLeaderboard();
    }, []);

    return (
      <>
        <div>
          <div className="w-full pt-40 pb-26 flex flex-col justify-center items-center bg-gradient-to-t from-primary to-[#8F5BFF] text-white overflow-hidden relative">
            {/* SPIRAL IMAGE */}
            <div 
              ref={spiralRef1} 
              className='z-10 w-[100%] md:w-[40%] h-auto absolute left-1 top-1'
              style={{ opacity: 0 }} // Set initial opacity in inline style to prevent flash
            >
              <img className='w-full h-auto' src={circleInception} alt=" " />
            </div>

            <div 
              ref={spiralRef2} 
              className='z-10 w-[100%] md:w-[40%] h-auto absolute left-full top-full'
              style={{ opacity: 0 }} // Set initial opacity in inline style to prevent flash
            >
              <img className='w-full h-auto' src={roundedStar} alt="" />
            </div>
    
            <div className="container flex flex-col justify-center items-center z-20">
              <FadeInUp delay={0.8}>
                <h1 className="text-center">Climb the ranks & Stay on top!</h1>
                <p className="text-off-white/80 max-w-3xl text-center mt-4">
                  Check out who’s leading the trivia challenge and see how you stack up. Compete for the top spot, earn bragging rights, and keep the grind going!
                </p>
              {/* SCROLLDOWN MESSAGE */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                <span className="text-xs mb-1 text-off-white/80">Scroll Down</span>
                <svg className="animate-bounce w-6 h-6 text-off-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              </FadeInUp>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto pt-15 pb-20 flex flex-col justify-center items-center gap-6 px-4 sm:px-6 lg:px-8 xl:px-0">
          <div className="flex items-end justify-center gap-1 mt-10 w-full">
            {[1, 0, 2].map((podiumIdx, i) => {
              const user = users[podiumIdx];
              const podium = [
                { 
                  height: 'h-37', color: 'bg-gradient-to-b from-gray-400', 
                  place: 2, 
                  medal: "bg-gradient-to-b from-gray-100 to-gray-300",
                  rounded: "rounded-tl-3xl"   
                },
                  
                { 
                  height: 'h-48', color: 'bg-gradient-to-b from-yellow-400', 
                  place: 1, 
                  medal: "bg-gradient-to-b from-yellow-100 to-yellow-300",
                  rounded: "rounded-t-3xl"   
                },
                  
                { 
                  height: 'h-30', color: 'bg-gradient-to-b from-amber-700', 
                  place: 3, 
                  medal: "bg-gradient-to-b from-amber-300 to-amber-600",
                  rounded: "rounded-tr-3xl"   
                },
                  
              ][i];
              if (!user) return <div key={i} className="flex-1"></div>;
              return (
                <FadeInUp key={user.id} className="flex flex-col items-center flex-1 gap-8" triggerStart='top 50%'>
                  {/* NAME */}
                  <div className="flex flex-col text-center gap-0.5">
                    <p className='text-primary text-sm'>{(user.questionsAnswered ?? 0) > 0
                        ? `${(((user.questionsCorrect ?? 0) / (user.questionsAnswered ?? 0)) * 100).toFixed(1)}%`
                        : "N/A"} Accuracy</p>
                    <h4 className="font-bold">{user.name || 'Unknown'}</h4>
                    <p className="text-gray text-sm">{user.points || 0} pts</p>
                  </div>

                  {/* PODIUM */}
                  <div className={`w-full ${podium.height} ${podium.color} ${podium.rounded} flex flex-col justify-center items-center relative`}>
                    <div className={`${podium.medal} h-11 w-11 aspect-square flex justify-center items-center rounded-full absolute -top-4 shadow-sm`}>
                      <h3 className='font-black'>{podium.place === 1 ? "1" : podium.place === 2 ? "2" : "3"} </h3>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
          {loading ? (
            <div className="flex flex-col space-y-4 justify-center items-center w-full h-[100vh] text-center">
              <div className="w-18 h-18 border-8 border-t-8 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              <h3 className="ml-2">Loading...</h3>
            </div>
          ) : (
            <div className="w-full overflow-y-hidden overflow-x-auto">
              <FadeInUp className="min-w-[500px] flex flex-col"  triggerStart='8% 50%'>
                {/* Header */}
                <div className="flex font-medium px-6 py-2">
                  <div className="w-1/6 text-left">Rank</div>
                  <div className="w-2/6 text-left">Name</div>
                  <div className="w-2/6 text-left">Points</div>
                  <div className="w-1/6 text-left">Accuracy</div>
                </div>
                {/* Rows */}
                <div className='flex flex-col gap-4'>
                  {users.slice(3).map((user, idx) => (
                    <div
                      key={user.id}
                      className={`flex px-6 py-4 border-1 border-gray/10 rounded-2xl bg-off-white/50`}
                    >
                      <p className="w-1/6">{idx + 4}</p>
                      <p className="w-2/6">{user.name || 'Unknown'}</p>
                      <p className="w-2/6">{user.points || 0}</p>
                      <p className="w-1/6">
                        {(user.questionsAnswered ?? 0) > 0
                          ? `${(((user.questionsCorrect ?? 0) / (user.questionsAnswered ?? 0)) * 100).toFixed(1)}%`
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeInUp>
            </div>
          )}
        </div>
      </>
    );
  };

  export default Leaderboard;