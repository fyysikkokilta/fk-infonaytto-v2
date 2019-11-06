import React from "react";
import { useSelector } from "react-redux";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Perjantai from "./pages/Perjantai";
import Inspirobot from "./pages/Inspirobot";
import HSLtimetable from "./pages/HSLtimetable";

const pages = [
  //Page1, 
  //Page2,
  Perjantai,
  Inspirobot,
  HSLtimetable,
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
