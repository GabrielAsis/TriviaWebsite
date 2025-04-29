import {
  logo,
  siteIcon,
  blitzSvg,
  customSvg,
  endlessSvg,
  grainyFilter,
  spiralShape,
  thinkingAvatar,
  endlessPng,
  blitzPng,
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
} from "../assets"

// MODES DATA
export const modes = [
  // BLITZ MODE
  {
    id: "0",
    title: "Blitz Mode",
    desc: "Race the clock, answer fast, and rack up points before time runs out!",
    url: "/questions?mode=blitz",
    icon: blitzSvg,
  },
  // CUSTOM MODE
  {
    id: "1",
    title: "Custom Mode",
    desc: "Pick your category, set the difficulty, and build your perfect quiz!",
    url: "/questions?mode=custom",
    icon: customSvg,
  },
  // ENDLESS MODE
  {
    id: "2",
    title: "Endless Mode",
    desc: "Answer endlessly, stay alive with 3 lives, and see how far you can go!",
    url: "/questions?mode=endless",
    icon: endlessSvg,
  } 
]