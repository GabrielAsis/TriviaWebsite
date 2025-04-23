import {
  logo,
  siteIcon,
  blitzSvg,
  customSvg,
  endlessSvg,
  grainyFilter,
  spiralShape,
} from "../assets"

// MODES DATA
export const modes = [
  // BLITZ MODE
  {
    id: "0",
    title: "Blitz Mode",
    desc: "Race the clock, answer fast, and rack up points before time runs out!",
    url: "/blitz",
    icon: blitzSvg,
  },
  // CUSTOM MODE
  {
    id: "1",
    title: "Custom Mode",
    desc: "Pick your category, set the difficulty, and build your perfect quiz!",
    url: "/custom",
    icon: customSvg,
  },
  // ENDLESS MODE
  {
    id: "2",
    title: "Endless Mode",
    desc: "Answer endlessly, stay alive with 3 lives, and see how far you can go!",
    url: "/endless",
    icon: endlessSvg,
  } 
]