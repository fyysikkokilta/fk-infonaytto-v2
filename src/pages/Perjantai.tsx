import React, { useEffect } from "react"
import perjantai from "../images/perjantai.mp4"
import { PageProps } from "../types"

export const Perjantai = ({ showNext }: PageProps) => 
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
      src={perjantai}
      itemType="video/mp4"
      width="100%"
    />
  </div>
)}


const exportObject = { priority: 2, isActive: () => new Date().getDay() === 5, component: Perjantai }

export default exportObject
