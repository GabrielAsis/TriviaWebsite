import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { Menu, X } from 'lucide-react'

import FadeInUp from "../Components/animations/FadeUp";

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <FadeInUp className="bg-transparent fixed top-0 z-100 w-full py-2 px-4 sm:px-6 lg:px-8 xl:px-0" id="navbar">
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-full ${scrolled ? 'py-3 px-6 bg-primary/60 backdrop-blur-sm' : ' py-6'}`}>
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
                <Link to="/categories" className="block">Categories</Link>
                <Link to="/leaderboards" className="block">Leaderboards</Link>
                <Link to="/modes" className="block">Modes</Link>
                <Link to="/login" className="block">
                  <Button variant='whiteOutline'>Log In</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant='white'>Sign Up</Button>
                </Link>
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
          <Link to="/login" className="block">
            <Button variant='whiteOutline'>Log In</Button>
          </Link>
          
          <Link to="/register" className="block">
            <Button variant='white'>Sign Up</Button>
          </Link>
        </div>
      </div>
    </FadeInUp>
  )
}

export default NavBar