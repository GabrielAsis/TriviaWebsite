import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'


const NavBar = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-transparent fixed top-0 z-50 w-full py-6">
      <div className="container flex items-center justify-between">
        <div className="flex lg:flex-1">
          <Link to="/" className="flex flex-row justify-center items-center space-x-6">
            <img
              alt="Logo"
              src="../../public/Images/Trivio Logo Icon.png"
              className="h-16 w-auto"
            />

            <h2 className='text-white'>Trivio</h2>
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
            <Button variant='ghost' className='rounded-md'>Categories</Button>
          </Link>

          <Link to="/leaderboards" className="text-sm">
            <Button variant='ghost' className='rounded-md'>Leaderboards</Button>
          </Link>

          <Link to="/modes" className="text-sm">
            <Button variant='ghost' className='rounded-md'>Modes</Button>
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
    </header>
  )
}

export default NavBar