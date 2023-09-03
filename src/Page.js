import React, { useState } from "react";
import Perjantai from "./pages/Perjantai";
import Inspirobot from "./pages/Inspirobot";
import HSLtimetable from "./pages/HSLtimetable";
import Wappulaskuri from "./pages/Wappulaskuri";
import Spotify from "./pages/Spotify";
import Ruokalista from "./pages/Ruokalista";
import Calendar from "./pages/Calendar"
import TelegramPost from "./pages/TelegramPosts"


const pages = [
  Perjantai,
  Inspirobot,
  HSLtimetable,
  Wappulaskuri,
  Spotify,
  Ruokalista,
  Calendar,
  TelegramPost
];

const weight = () => -Math.log(Math.random());

export const selectPage = pages => {
  return pages
    .filter(p => p.isActive())
    .map((p, index) => ({ index, priority: p.priority * weight() }))
    .reduce((x, p) => (p.priority > x.priority ? p : x)).index;
};

export const Page = () => {
  const [current, setCurrent] = useState(selectPage(pages));

  const showNext = timeout => setTimeout(() => setCurrent(selectPage(pages.filter((page, i) => i !== current))), timeout)

  const CurrentPage = pages[current].component;

  return <CurrentPage showNext={showNext}/>;
};
