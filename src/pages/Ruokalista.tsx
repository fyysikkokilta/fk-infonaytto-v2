import React, { useState, useEffect } from 'react'
import styles from '../css/ruokalista.module.css'
import { PageProps } from '../types'

const restaurants = {
  1: 'Kvarkki',
  5: 'Alvari',
  3: 'Täffä',
  45: 'Dipoli',
  50: 'Kipsari Väre',
  52: 'A Bloc'
}

type RestaurantId = keyof typeof restaurants

type RestaurantMenu = [
  RestaurantId,
  Record<string, { title: string; properties: string[] }[]>
]

const timePerFrame = 5

// Remove item from Fazer menus to make them fit
const pruneDish = (str: string) => {
  return (
    str.includes('Grillistä') ||
    str.includes('Päivän Salaatti') ||
    str.includes('Wicked Rabbit') ||
    str.includes('Jälkiruoka')
  )
}

const listDishes = (menu: RestaurantMenu) => {
  const date = new Date()
  const today = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 10)
  if (!menu) {
    return <p>Ei aukiolevia ravintoloita</p>
  }

  if (menu[1]?.[today]) {
    return (
      <div>
        {menu[1]?.[today].map((dish, index) =>
          pruneDish(dish.title) ? (
            ''
          ) : (
            <div key={index}>
              <p>
                {dish.title} {dish.properties.join(' ')}
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

const Menu = ({ menu }: { menu: RestaurantMenu }) => {
  return (
    <div className={styles.mask}>
      {menu && <h1 className={styles.h1}> {restaurants[menu[0]]} </h1>}
      <div className={styles.text}>{listDishes(menu)}</div>
    </div>
  )
}

export const Ruokalista = ({ showNext }: PageProps) => {
  const [menu, setMenu] = useState([])
  const [indexOfRestaurantID, setIndexOfRestaurantID] = useState(0)

  useEffect(() => {
    let id: Timer
    fetch('/api/open-restaurants').then(async (response) => {
      const openRestaurants = await response.json()
      setMenu(openRestaurants)
      id = setInterval(() => {
        setIndexOfRestaurantID(
          // Loop over restaurants. Can't take modulo zero cause it is NaN
          (prev) => (prev + 1) % (openRestaurants.length || 1)
        )
      }, timePerFrame * 1000)
    })

    showNext(Object.keys(restaurants).length * timePerFrame * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.background}>
      <Menu menu={menu?.[indexOfRestaurantID]} />
    </div>
  )
}

const exportObject = {
  name: 'Ruokalista',
  priority: 3,
  isActive: () => true,
  component: Ruokalista
}

export default exportObject
