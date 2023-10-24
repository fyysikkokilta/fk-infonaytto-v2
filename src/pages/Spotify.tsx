import React, { useState, useEffect } from "react"
import styles from "../css/spotify.module.css"
import ColorThief from "colorthief"
import { PageProps } from "../types"

type SpotifyHistory = {
  artist: string
  title: string
  timestamp: number
  thumbnail: string
}

const Table = ({ spotifyHistory }: { spotifyHistory: SpotifyHistory[] }) => (
  <div className={styles.text}>
    <h1 id="h1" className={styles.h1}>Kiltiksellä soi</h1>
    <table id="table" className={styles.table}>
      <tbody>
        {spotifyHistory.map((item, index) => {
          const timeMinutes =
            (Date.now() / 1000 - item.timestamp) / 60
          const [time, timeUnit] =
            timeMinutes > 60
              ? [Math.floor(timeMinutes / 60), "h"]
              : [Math.floor(timeMinutes), "min"]
          return (
            <tr key={index}>
              <td className={styles.td}>{item.artist}</td>
              <td className={styles.td}>{item.title}</td>
              <td className={styles.td}>
                <span className={styles.span}>
                  {time} {timeUnit} ago
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)

const BackgroundImage = ({ imageURL }: { imageURL: string }) => (
  <img
    id="albumCover"
    crossOrigin={"anonymous"}
    src={imageURL}
    className={styles.img}
    alt={"Album cover"}
    onLoad={() => {
      // When image has loaded, use colorthief to extract colors from image and set page colors accordingly.
      const colorThief = new ColorThief()
      const img = document.getElementById("albumCover") as HTMLImageElement
      const colors = colorThief.getPalette(img, 2)

      const r1 = colors[0][0]
      const g1 = colors[0][1]
      const b1 = colors[0][2]
      const r2 = colors[1][0]
      const g2 = colors[1][1]
      const b2 = colors[1][2]

      document.getElementById("h1")!.style.color = `rgb(${r2},${g2}, ${b2})`
      document.getElementById("table")!.style.color = `rgb(${r2},${g2}, ${b2})`
      document.getElementById("mask")!.style.background = `rgba(${r1},${g1}, ${b1}, 0.87)`
    }}
  />
)

export const Spotify = ({ showNext }: PageProps) => {
  const [spotifyHistory, setSpotifyHistory] = useState<SpotifyHistory[]>([])

  useEffect(() => {
    fetch("/api/history").then(async response => {
      setSpotifyHistory(await response.json())
    })

    showNext(30000)
  }, [])

  return (
    <div>
      <BackgroundImage imageURL={spotifyHistory[0]?.thumbnail} />
      <div id="mask" className={styles.mask}></div>
      <Table spotifyHistory={spotifyHistory} />
    </div>
  )
}

const exportObject = { name: 'Spotify', priority: 3, isActive: () => true, component: Spotify }

export default exportObject
