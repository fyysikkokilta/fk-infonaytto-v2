import React, { useState, useEffect } from 'react'
import ColorThief from "colorthief"
import styles from "../css/flickr.module.css"
import { PageProps } from '../types'

//Api key needs to be set for this page to work
const apiKey = Bun.env.FLICKR_API_KEY
const userId = "87690636@N05"
const amountOfAlbumsToFetch = 5

export const Flickr = ({ showNext }: PageProps) => {
  const [state, setState] = useState({ imageURL: "", title: "", desc: "" })

  useEffect(() => {
    void (async () => {
      const flickrUserAddress = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&per_page=${amountOfAlbumsToFetch}&format=json&nojsoncallback=1`
      const albums = (await (await fetch(flickrUserAddress)).json()).photosets.photoset
      const albumToChoose = Math.round(Math.random()*(albums.length-1))
      const album = albums[albumToChoose]
      const flickrAlbumAddress = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&user_id=${userId}&photoset_id=${album.id}&format=json&nojsoncallback=1`
      const photos = (await (await fetch(flickrAlbumAddress)).json()).photoset.photo
      const photoToChoose = Math.round(Math.random()*(photos.length-1))
      const photo = photos[photoToChoose]
      setState({
        imageURL: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
        title: album.title._content,
        desc: album.description._content
      })
    })()
    showNext(15000)
  }, [])

  return (
    <div id="background">
      <div id="header" className={styles.header}> {state.title}</div>
      <div>
        <img
          src={state.imageURL}
          className={styles.image}
          id="flickrImg"
          crossOrigin={"anonymous"}
          alt="Flickr"
          onLoad={() => {
            // When image has loaded, use colorthief to extract colors from image and set page colors accordingly.
            const colorThief = new ColorThief()
            const img = document.getElementById("flickrImg") as HTMLImageElement
            const colors = colorThief.getPalette(img, 3)
    
            const r1 = colors[0][0]
            const g1 = colors[0][1]
            const b1 = colors[0][2]
            const r2 = colors[1][0]
            const g2 = colors[1][1]
            const b2 = colors[1][2]
            const r3 = colors[2][0]
            const g3 = colors[2][1]
            const b3 = colors[2][2]
    
              document.getElementById("header")!.style.color = `rgb(${r1},${g1}, ${b1})`
              document.getElementById("header")!.style.background = `rgb(${r2},${g2}, ${b2})`
              document.getElementById("footer")!.style.color = `rgb(${r1},${g1}, ${b1})`
              document.getElementById("footer")!.style.background = `rgb(${r2},${g2}, ${b2})`
              document.getElementById("background")!.style.background = `rgb(${r3},${g3}, ${b3})`
          }}
        />
      </div>
      <div id="footer" className={styles.footer}>{state.desc}</div>
    </div>
  )
}

const exportObject = { name: 'Flickr', priority: 2, isActive: () => true, component: Flickr }

export default exportObject
