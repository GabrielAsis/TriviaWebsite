// components/animations/FadeInUp.jsx
import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FadeInUp({
  children,
  delay = 0,
  duration = 1,
  yOffset = 30,
  stagger = 0.2,
  triggerStart = "top 90%",
  toggleActions = "play none none none",
  useScrollTrigger = true,
  showMarkers = false,
  className = "",
  id = "",
}) {
  const ref = useRef(null)

  useGSAP(() => {
    const animationConfig = {
      y: yOffset,
      opacity: 0,
      duration,
      delay,
      stagger,
      ease: "circ.inOut",
    }

    if (useScrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: ref.current,
        start: triggerStart,
        toggleActions,
        markers: showMarkers,
      }
    }

    gsap.from(ref.current?.children, animationConfig)
  }, [])

  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  )
}
