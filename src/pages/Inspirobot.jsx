import React, { useState, useEffect } from "react"
import axios from "axios"

const imageStyle = {
  'display': 'block',
  'marginLeft': 'auto',
  'marginRight': 'auto',
  'width': '90vh',
  'transform': 'translateY(5%)',   // Vertical align for image
}

export const Inspirobot = ({ showNext }) => {
  const [imageURL, setImageURL] = useState("")

  // Invoced when component is added to DOM. Calls Inspirobot's api to get image src
  useEffect(() => {
    axios.get("https://inspirobot.me/api?generate=true").then(response => {
      setImageURL(response.data)
    })

    const id = showNext(15000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div>
      <img
        src={imageURL}
        style={imageStyle}
        alt="Motivational quote"
      />
    </div>
  )
}

const exportObject = { priority: 1, isActive: () => true, component: Inspirobot }

export default exportObject