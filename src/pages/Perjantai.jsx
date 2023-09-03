import React, { useEffect } from "react";
import perjantai from "../images/perjantai.mp4";

export const Perjantai = ({ showNext }) => 
  // TODO consider showing this upside down, mirrored, as tiled background...
{
  useEffect(() => {
    const id = showNext(15000)
    return () => clearTimeout(id)
  }, [])

  return (
  <div>
    <video
      autoPlay
      loop
      alt="perjantai"
      src={perjantai}
      type="video/mp4"
      width="100%"
    />
  </div>
)}


const exportObject = { priority: 2, isActive: () => new Date().getDay() === 5, component: Perjantai }

export default exportObject