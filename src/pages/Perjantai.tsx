import React, { useEffect } from 'react'
import perjantai from '../images/perjantai.mp4'
import { PageProps } from '../types'

export const Perjantai = ({ showNext }: PageProps) => {
  useEffect(() => {
    showNext(15000)
  }, [])

  return (
    <div>
      <video
        autoPlay
        muted
        loop
        src={perjantai}
        itemType="video/mp4"
        width="100%"
      />
    </div>
  )
}

const exportObject = {
  name: 'Perjantai',
  priority: 2,
  isActive: () => new Date().getDay() === 5,
  component: Perjantai
}

export default exportObject
