import React, { useState, useMemo } from "react"
import Perjantai from "./pages/Perjantai"
import Inspirobot from "./pages/Inspirobot"
import HSLtimetable from "./pages/HSLtimetable"
import Wappulaskuri from "./pages/Wappulaskuri"
import Spotify from "./pages/Spotify"
import Ruokalista from "./pages/Ruokalista"
import Calendar from "./pages/Calendar"
import TelegramPost from "./pages/TelegramPosts"
import Flickr from "./pages/Flickr"
import { PageType } from "./types"
import { motion } from "framer-motion"

const pages = [
  Perjantai,
  Inspirobot,
  HSLtimetable,
  Wappulaskuri,
  Spotify,
  Ruokalista,
  Calendar,
  TelegramPost,
  Flickr
] as PageType[]

const weight = () => -Math.log(Math.random())

const selectPage = (current: string | null) => {
  return pages
    .filter(p => p.isActive())
    .filter(p => p.name !== current)
    .map(p => ({ name: p.name, priority: p.priority * weight() }))
    .reduce((x, p) => (p.priority > x.priority ? p : x)).name
}

export const Page = () => {
  const initial = useMemo(() => selectPage(null), [])
  const [current, setCurrent] = useState(initial)

  const showNext = (timeout: number) => setTimeout(() => setCurrent(current => selectPage(current)), timeout)

  const currentPage = pages.find(({ name }) => name === current)!

  const CurrentPage = currentPage.component

  return (
    <motion.div key={current} 
      initial={{ x: '-100%', height: '100%' }}
      animate={{ x: 0, height: '100%' }}
      exit={{ x: '-100%', height: '100%' }}
      transition={{ duration: 0.5 }}>
      <CurrentPage key={current} showNext={showNext}/>
    </motion.div>
  )
}
