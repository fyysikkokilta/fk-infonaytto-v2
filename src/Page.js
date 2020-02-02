import React from "react";
import { useSelector } from "react-redux";
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

export const selectPage = () => {
  return pages
    .filter(p => p.isActive())
    .map(p => ({ page: p, priority: p.priority * weight() }))
    .reduce((x, p) => (p.priority > x.priority ? p : x)).page;
};

export const Page = () => {
  const SubPage = useSelector(state => state.page.component);

  return <SubPage />;
};
