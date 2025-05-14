import {
  logo,
  siteIcon,
  blitzSvg,
  customSvg,
  endlessSvg,
  strikeSvg,
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
  whiteBlitz,
  whiteStrike,
  whiteEndless,
} from "../assets"

// MODES DATA
export const modes = [
  // BLITZ MODE
  {
    id: "blitz",
    title: "Blitz Mode",
    desc: "Race the clock, answer fast, and rack up points before time runs out!",
    url: "/settings?mode=blitz",
    icon: blitzSvg,
    whiteIcon: whiteBlitz,
  },
  // STRIKE MODE
  {
    id: "strike",
    title: "Strike Mode",
    desc: "No second chances—one wrong answer and it's game over.",
    url: "/settings?mode=strike",
    icon: strikeSvg,
    whiteIcon: whiteStrike,

  },
  // ENDLESS MODE
  {
    id: "endless",
    title: "Endless Mode",
    desc: "Answer endlessly, stay alive with 3 lives, and see how far you can go!",
    url: "/settings?mode=endless",
    icon: endlessSvg,
    whiteIcon: whiteEndless,
  } 
]