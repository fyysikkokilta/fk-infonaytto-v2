import React, { useState, useEffect } from "react";
import moment from "moment";
import styles from "../css/wappulaskuri.module.css"
import { apiKeys } from "../apiKeys"

const nextWappu = moment(`${moment().year()}-05-01 00:00:00`);
const wappuDeclared = apiKeys["wappuDeclared"] || false

if (nextWappu < moment()) {
  nextWappu.add(1, 'year')
}

const Counter = ({timeUnit, text}) => (
  <div className={[styles.display, styles.score].join(' ')}>
    <h2 className={styles.number}>{timeUnit}</h2>
    <br />
    <span className={styles.text}>{text}</span>
  </div>
)

export const Wappulaskuri = ({ showNext }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const difference = nextWappu.diff(moment(), "seconds")

      setDays(Math.floor(difference / (24 * 60 * 60)));
      setHours(Math.floor(difference % (24 * 60 * 60) / (60 * 60)));
      setMinutes(Math.floor(difference % (24 * 60 * 60) % (60 * 60) / 60));
      setSeconds(difference % (24 * 60 * 60) % (60 * 60) % 60);
    }, 1000);

    const id2 = showNext(20000)
    return () => {
      clearInterval(id)
      clearTimeout(id2)
    }
  }, [])

  return (
    <div className={styles.background}>
      <div className={styles.cover}></div>
      <h1 className={wappuDeclared ? styles.title : styles.possibleTitle}>{wappuDeclared ? "Aikaa Wappuun" : "Aikaa Mahdolliseen Wappuun"}</h1>
      <div className={styles.row}>
        <Counter timeUnit={days} text={"Päivää"}/>
        <Counter timeUnit={hours} text={"Tuntia"}/>
        <Counter timeUnit={minutes} text={"Minuuttia"}/>
        <Counter timeUnit={seconds} text={"Sekuntia"}/>
      </div>
    </div>
  )
}

const exportObject = { priority: 2, isActive: () => true, component: Wappulaskuri }

export default exportObject