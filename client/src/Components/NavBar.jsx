import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

// Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";

// shadcn imports
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Menu } from 'lucide-react';

import Login from '../../pages/Login';
import Register from '../../pages/Register';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  
  const location = useLocation();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in, get their data from Firestore
          const userDocRef = doc(db, "Users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Set user in context with combined data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              // Add any other user data from Firestore here
            });
          } else {
            console.log("No user data found in Firestore");
            // User exists in Auth but not in Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.email.split('@')[0], // Fallback name from email
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser]);

  // Handle scroll effects (keeping your original code)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isColoredBgPage = location.pathname === "/settings";

  return (
    
    <header className={`z-100 w-full py-2 px-4 sm:px-6 lg:px-8 xl:px-0 ${isColoredBgPage ? 'bg-primary border-accent border-b-2' : 'bg-transparent fixed top-0 '} transition-all duration-500`} id="navbar">
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full ${scrolled ? 'py-3 px-6 bg-primary/60 backdrop-blur-sm border-primary ' : ' py-6'}`}>
        <div className="flex lg:flex-1">
          <Link to="/" className="flex flex-row justify-center items-center space-x-4 scale-100">
            <img
              alt="Logo"
              src="../../src/assets/Trivio Logo Icon.png"
              className={`w-auto transition-all duration-500 ${scrolled ? 'h-11' : 'h-16'}`}
            />
            <h2 className={`text-white transition-all duration-500 ${scrolled ? 'text-[1.5rem]' : 'text-2rem'}`}>Trivio</h2>
          </Link>
        </div>

        {/* MOBILE NAV */}
        <div className="flex lg:hidden">
          <Sheet open={open} onOpenChange={setOpen} className="bg-primary">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="space-y-4 m-8 text-off-white">
                <Link to="/categories" onClick={() => setOpen(false)} className="block">Categories</Link>
                <Link to="/leaderboards" onClick={() => setOpen(false)} className="block">Leaderboards</Link>
                <Link to="/modes" onClick={() => setOpen(false)} className="block">Modes</Link>

                <div className="flex flex-col space-y-4 w-fit">
                  {user ? (
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className="font-bold">
                        {user.name
                        ? user.name
                            .match(/[A-Z]/g) // Extract uppercase letters (e.g., "GabrielAsis" → "GA")
                            ?.slice(0, 2) // Take the first two letters
                            .join('') || user.name.slice(0, 2).toUpperCase() // Fallback to first two characters if no uppercase letters
                        : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  ) : (
                    <>
                      <Login
                        isOpen={openLogin}
                        setIsOpen={setOpenLogin}
                        openRegister={() => {
                          setOpenLogin(false);
                          setOpenRegister(true);
                        }}
                      />
                      <Register
                        isOpen={openRegister}
                        setIsOpen={setOpenRegister}
                        openLogin={() => {
                          setOpenRegister(false);
                          setOpenLogin(true);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex lg:gap-x-8 text-off-white">
          <Link to="/categories" className="text-sm">
            <Button variant='ghost' className='rounded-md font-normal'>Categories</Button>
          </Link>
          <Link to="/leaderboards" className="text-sm">
            <Button variant='ghost' className='rounded-md font-normal'>Leaderboards</Button>
          </Link>
          <Link to="/modes" className="text-sm">
            <Button variant='ghost' className='rounded-md font-normal'>Modes</Button>
          </Link>
        </nav>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
          {user ? (
            <Link to="/dashboard">
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>
                  {user.name
                  ? user.name
                      .match(/[A-Z]/g) // Extract uppercase letters (e.g., "GabrielAsis" → "GA")
                      ?.slice(0, 2) // Take the first two letters
                      .join('') || user.name.slice(0, 2).toUpperCase() // Fallback to first two characters if no uppercase letters
                  : 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Login
                isOpen={openLogin}
                setIsOpen={setOpenLogin}
                openRegister={() => {
                  setOpenLogin(false);
                  setOpenRegister(true);
                }}
              />
              <Register
                isOpen={openRegister}
                setIsOpen={setOpenRegister}
                openLogin={() => {
                  setOpenRegister(false);
                  setOpenLogin(true);
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
