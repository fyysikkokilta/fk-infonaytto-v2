/* eslint-disable no-undef */
import React from "react";
import axios from "axios";
import styles from "../css/ruokalista.module.css";

// TODO: Kämälista that respects capitalization and 

const today = new Date().toISOString().substring(0, 10);
const restaurants = {
  1: "Kvarkki",
  5: "Alvari",
  3: "Täffä",
  45: "Dipoli",
  50: "Kipsari Väre",
  51: "Studio Kipsari",
  52: "A Bloc"
};
// Hard coded opening hours for restaurants
const isOpen = (restaurantID) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  switch (restaurants[restaurantID]) {
    case "Kvarkki":
      return currentHour < 14 && currentDay !== 0 && currentDay !== 6
    case "Täffä":
      return currentHour < 15 && currentDay !== 0 && currentDay !== 6
    case "Alvari":
      return currentHour < 16 && currentDay !== 0 && currentDay !== 6
    case "Kipsari Väre":
      return currentHour < 18 && currentDay !== 0 && currentDay !== 6
    case "Studio Kipsari":
      return (currentHour < 14 || (currentHour === 14 && currentMinute < 30)) && currentDay !== 0 && currentDay !== 6
    case "Dipoli":
      return (currentHour < 19 && currentDay !== 0 && currentDay !== 6) || (currentHour < 16 && (currentDay === 0 || currentDay === 6))
    case "A Bloc":
      return (currentHour < 19 && currentDay !== 0 && currentDay !== 6) || (currentHour < 16 && (currentDay === 0 || currentDay === 6))
    default:
      return false
  }
} 
const openRestaurants = Object.keys(restaurants).filter(restaurant => isOpen(restaurant));
const timePerFrame = 7;

// Remove item from Fazer menus to make them fit
const pruneDish = str => {
  return (
    str.includes("Grillistä") ||
    str.includes("Päivän Salaatti") ||
    str.includes("Wicked Rabbit") ||
    str.includes("Jälkiruoka")
  );
};

const listDishes = (menu, restaurantID, date) => {
  if (menu === "") {
    return "";
  }

  if (menu[restaurantID].hasOwnProperty(date)) {
    return (
      <div>
        {menu[restaurantID][date].map((dish, index) =>
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
    );
  } else {
    return <p>Listaa ei saatavilla</p>;
  }
};

const Menu = ({ menu, restaurantID, date }) => {
  return (
    <div className={styles.mask}>
      <h1 className={styles.h1}> {restaurants[restaurantID]} </h1>
      <div className={styles.text}>{listDishes(menu, restaurantID, date)}</div>
    </div>
  );
};

export default class Ruokalista extends React.Component {
  state = {
    menu: "",
    indexOfRestaurantID: 0
  };

  static timeout = openRestaurants.length * timePerFrame * 1000;
  static priority = 3;

  static isActive() {
    return openRestaurants.length !== 0;
  }

  componentDidMount() {
    axios
      .get(
        `https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants=${openRestaurants.join()}&days=${this.state.date}`
      )
      .then(respose => {
        this.setState({ menu: respose.data });
        setInterval(() => {
          this.setState({
            indexOfRestaurantID: (this.state.indexOfRestaurantID + 1) % openRestaurants.length
          });
        }, 1000 * timePerFrame);
      });
  }

  render() {
    const { menu, indexOfRestaurantID } = this.state;

    return (
      <div className={styles.background}>
        <Menu
          menu={menu}
          restaurantID={openRestaurants[indexOfRestaurantID]}
          date={today}
        />
      </div>
    );
  }
}
