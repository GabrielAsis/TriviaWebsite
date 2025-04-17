// components/animations/FadeInUp.jsx
import React, { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function FadeInUp({
  children,
  delay = 0,
  duration = 1,
  yOffset = 30,
  stagger = 0.2,
  className = "",
}) {
  const ref = useRef(null)

  useGSAP(() => {
    gsap.from(ref.current?.children, {
      y: yOffset,
      opacity: 0,
      duration,
      delay,
      stagger,
      ease: "circ.inOut",
    })
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
