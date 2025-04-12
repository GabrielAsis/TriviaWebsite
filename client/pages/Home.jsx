import React from 'react'

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <h1>H1</h1>
      <h2>H2</h2>
      <h2>H2</h2>
      <h3>H3</h3>
      <h4>H4</h4>
      <p>Lorem Ipsum </p>
      
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
      </div>
    </div>

  )
}
