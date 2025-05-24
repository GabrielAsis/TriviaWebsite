import React from 'react'

// asset imports
import { logo } from "../assets"
import { Link } from 'react-router'

const Footer = () => {
  return (
    <footer class="bg-black">
      <div class="container py-12 md:py-14 lg:py-16">
        <div class="flex flex-col md:flex-row md:justify-between items-stretch gap-12 md:gap-15">
          {/* SITE DETAILS */}
          <div class="flex flex-col gap-4 justify-between flex-1/2">
            <div className='flex flex-col gap-4 '>
              <Link to='/' class="flex items-center gap-0.5">
                <img src={logo} class="h-15 me-3" alt="FlowBite Logo" />
                <h2 class="self-center whitespace-nowrap text-white">Trivio</h2>
              </Link>
              <p className='text-off-white/80 text-sm'>A fun and engaging trivia platform designed to challenge your knowledge, compete on the leaderboard, and explore a variety of exciting categories.</p>
            </div>

            <p className='text-off-white/80 text-sm'>Made by Gabriel Gono Asis | © 2025 Trivio. All rights reserved.</p>
          </div>  

          {/* LINKS */}
          <div class="grid grid-cols-1 gap-12 sm:gap-12 sm:grid-cols-2 flex-1/2">
            {/* PAGES */}
            <div className='flex flex-col gap-6'>
              <h4 class="text-white">Pages</h4>
              <ul class="text-off-white/80 flex flex-col gap-6">
                <li>
                  <Link to='/' class="hover:underline hover:opacity-80">Home</Link>
                </li>
                <li>
                  <Link to='/categories' class="hover:underline hover:opacity-80">Category</Link>
                </li>
                <li>
                  <Link to='/leaderboard' class="hover:underline hover:opacity-80">Leaderboard</Link>
                </li>
                <li>
                  <Link to='/modes' class="hover:underline hover:opacity-80">Modes</Link>
                </li>
              </ul>
            </div>
            
            {/* RESOURCES */}
            <div className='flex flex-col gap-6'>
              <h4 class="text-white">Resources</h4>
              <ul class="text-off-white/80 flex flex-col gap-6">
                <li>
                  <a href='https://opentdb.com/' class="hover:underline hover:opacity-80">API</a>
                </li>
                <li>
                  <a href='https://docs.google.com/document/d/11Ya6WeZRel6ml4ShL8aT75cMnBfi7g-kO5KIOwIbcLE/edit?usp=sharing' class="hover:underline hover:opacity-80">Documentation</a>
                </li>
                <li>
                  <a href='https://www.figma.com/design/VfS2bSs02lowL6TqOalHFg/Trivio-Site?node-id=0-1&t=ZGLxKLYiAA7UAxEP-1' class="hover:underline hover:opacity-80">Prototype</a>
                </li>
                <li>
                  <a href='https://github.com/GabrielAsis/TriviaWebsite.git' class="hover:underline hover:opacity-80">GitHub Repository</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer