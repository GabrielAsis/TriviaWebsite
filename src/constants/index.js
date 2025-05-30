import {
  blitzSvg,
  endlessSvg,
  strikeSvg,
  whiteBlitz,
  whiteStrike,
  whiteEndless,
  generalKnowledge,
  books,
  movies,
  music,
  theatre,
  tv,
  games,
  boardGames,
  science,
  tech,
  maths,
  myths,
  sports,
  world,
  history,
  politics,
  art,
  celebrity,
  animals,
  vehicle,
  comic,
  gadget,
  anime,
  cartoons,
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

// CATEGORIES DATA
export const categoryData = {
  9: {
    name: "General Knowledge",
    image: generalKnowledge,
    description: "A bit of everything to test your all-around smarts.",
    tag: "All-Around"
  },
  10: {
    name: "Page Turner Trivia",
    image: books,
    description: "From classics to bestsellers, see how well you know your books.",
    tag: "Literature"
  },
  11: {
    name: "Movie Mania",
    image: movies,
    description: "Challenge your knowledge of iconic scenes and silver screen moments.",
    tag: "Entertainment"
  },
  12: {
    name: "Music Match",
    image: music,
    description: "From rock to pop, test your memory of music and melodies.",
    tag: "Entertainment"

  },
  13: {
    name: "Musicals & Theatre",
    image: theatre,
    description: "Explore the world of Broadway and musical storytelling.",
    tag: "Entertainment"

  },
  14: {
    name: "TV Time Trivia",
    image: tv,
    description: "How well do you remember your favorite shows?",
    tag: "Entertainment"

  },
  15: {
    name: "Gamer Knowledge",
    image: games,
    description: "Level up your score with video game trivia.",
    tag: "Gaming"

  },
  16: {
    name: "Board Game Quiz",
    image: boardGames,
    description: "From classics to strategy games, put your skills to the test.",
    tag: "Gaming"

  },
  17: {
    name: "Science & Nature",
    image: science,
    description: "Test your curiosity with facts about the natural world.",
    tag: "Educational"

  },
  18: {
    name: "Computer Trivia",
    image: tech,
    description: "Explore computing concepts, history, and innovations.",
    tag: "Tech"

  },
  19: {
    name: "Math Mind",
    image: maths,
    description: "Put your number sense and logic to the test.",
    tag: "Educational"

  },
  20: {
    name: "Myths & Legends",
    image: myths,
    description: "Dive into ancient stories, gods, and myths.",
    tag: "Literature & Educational"

  },
  21: {
    name: "Sports Quiz",
    image: sports,
    description: "From football to fencing—how much do you really know?",
    tag: "Athletics"

  },
  22: {
    name: "World Explorer",
    image: world,
    description: "Name countries, landmarks, and global trivia.",
    tag: "Geography"

  },
  23: {
    name: "History Hub",
    image: history,
    description: "Step back in time and see what you remember.",
    tag: "Literature & Educational"

  },
  24: {
    name: "Politics Quiz",
    image: politics,
    description: "Test your knowledge of leaders, systems, and political events.",
    tag: "Contreversial"

  },
  25: {
    name: "Art & Design",
    image: art,
    description: "From paintings to movements, explore the world of art.",
    tag: "Culture"

  },
  26: {
    name: "Famous Faces",
    image: celebrity,
    description: "Recognize the names and stories behind the stars.",
    tag: "Pop Culture"

  },
  27: {
    name: "Animal Quiz",
    image: animals,
    description: "From land to sea, test your animal knowledge.",
    tag: "Nature"

  },
  28: {
    name: "Vehicle Trivia",
    image: vehicle,
    description: "Planes, trains, and automobiles—quiz yourself on them all.",
    tag: "Tech"

  },
  29: {
    name: "Comic Clash",
    image: comic,
    description: "From superheroes to strips, how well do you know comics?",
    tag: "Pop Culture"

  },
  30: {
    name: "Gadget Geeks",
    image: gadget,
    description: "Tech toys and tools through the years.",
    tag: "Tech"

  },
  31: {
    name: "Anime & Manga",
    image: anime,
    description: "From shonen to slice of life—how deep is your anime knowledge?",
    tag: "Pop Culture"

  },
  32: {
    name: "Cartoons & Animation",
    image: cartoons,
    description: "Relive animated moments from childhood to today.",
    tag: "Entertainment"

  }
};