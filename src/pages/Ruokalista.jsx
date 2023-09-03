import React, { useState, useEffect } from "react"
import axios from "axios"
import styles from "../css/ruokalista.module.css"

// TODO: Kämälista that respects capitalization
const date = new Date()
const today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0,10)
const restaurants = {
  1: "Kvarkki",
  5: "Alvari",
  3: "Täffä",
  45: "Dipoli",
  50: "Kipsari Väre",
  51: "Studio Kipsari",
  52: "A Bloc"
}
const timePerFrame = 5

// Remove item from Fazer menus to make them fit
const pruneDish = str => {
  return (
    str.includes("Grillistä") ||
    str.includes("Päivän Salaatti") ||
    str.includes("Wicked Rabbit") ||
    str.includes("Jälkiruoka")
  )
}

const listDishes = (menu, date) => {
  if (!menu) {
    return <p>Ei aukiolevia ravintoloita</p>
  }

  if (menu[1]?.[date]) {
    return (
      <div>
        {menu[1]?.[date].map((dish, index) =>
          pruneDish(dish.title) ? (
            ""
          ) : (
            <div key={index}>
              <p>
                {dish.title} {dish.properties.join(" ")}
              </p>
            </div>
          )
        )}
      </div>
    )
  } else {
    return <p>Listaa ei saatavilla</p>
  }
}

const Menu = ({ menu, date }) => {
  return (
    <div className={styles.mask}>
      {menu && <h1 className={styles.h1}> {restaurants[menu[0]]} </h1>}
      <div className={styles.text}>{listDishes(menu, date)}</div>
    </div>
  )
}

export const Ruokalista = ({ showNext }) => {
  const [menu, setMenu] = useState([])
  const [indexOfRestaurantID, setIndexOfRestaurantID] = useState(0)

  useEffect(() => {
    let id
    axios.get('open-restaurants').then(response => {
      setMenu(response.data)
      setInterval(() => {
        setIndexOfRestaurantID((indexOfRestaurantID + 1) % response.data.length)
      }, timePerFrame * 1000)
      id = showNext(response.data.length * timePerFrame * 1000)
    })
    return () => clearTimeout(id)
  }, [])

  return (
    <div className={styles.background}>
      <Menu
        menu={menu?.[indexOfRestaurantID]}
        date={today}
      />
    </div>
  )
}

const exportObject = { priority: 3, isActive: () => true, component: Ruokalista }

export default exportObject