/* eslint-disable no-undef */
import React from "react";
import axios from "axios";
import styles from "../css/ruokalista.module.css";

// TODO: Kämälista that respects capitalization
const date = new Date();
const today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0,10);
const restaurants = {
  1: "Kvarkki",
  5: "Alvari",
  3: "Täffä",
  45: "Dipoli",
  50: "Kipsari Väre",
  51: "Studio Kipsari",
  52: "A Bloc"
};
const restaurantIDs = Object.keys(restaurants);
const timePerFrame = 5;

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
    return <p>Ei aukiolevia ravintoloita</p>;
  }

  if (menu[restaurantID]?.hasOwnProperty(date)) {
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
      {menu !== "" && <h1 className={styles.h1}> {restaurants[restaurantID]} </h1>}
      <div className={styles.text}>{listDishes(menu, restaurantID, date)}</div>
    </div>
  );
};

export default class Ruokalista extends React.Component {
  state = {
    menu: "",
    indexOfRestaurantID: 0
  };

  static timeout = restaurantIDs.length * timePerFrame * 1000;
  static priority = 3;

  static isActive() {
    return restaurants.length !== 0;
  }

  componentDidMount() {
    const now = new Date();
    let currentDay = now.getDay();
    currentDay = currentDay === 0 ? 6 : currentDay - 1;
    axios.get(`https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=${restaurantIDs.join()}&priceCategories=student,studentPremium`)
      .then(response => {
        return response.data.filter(restaurant => {
          const todayOpenings = restaurant.openingHours[currentDay]
          if(!todayOpenings) return false
          const [open, close] = todayOpenings.split("-")
          const [openHour, openMinute] = open.split(":")
          const [closeHour, closeMinute] = close.split(":")
          const openTime = new Date()
          openTime.setHours(openHour)
          openTime.setMinutes(openMinute)
          const closeTime = new Date()
          closeTime.setHours(closeHour)
          closeTime.setMinutes(closeMinute)
          return openTime < now && now < closeTime
        }).map(restaurant => restaurant.id)
        }).then(openRestaurants => {
          if(openRestaurants.length === 0) return
          axios
            .get(
              `https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants=${openRestaurants}&days=${today}`
            )
            .then(response => {
              this.setState({ menu: response.data });
              setInterval(() => {
                this.setState({
                  indexOfRestaurantID: (this.state.indexOfRestaurantID + 1) % restaurantIDs.length
                });
              }, 1000 * timePerFrame);
            });
        })
  }

  render() {
    const { menu, indexOfRestaurantID } = this.state;

    return (
      <div className={styles.background}>
        <Menu
          menu={menu}
          restaurantID={restaurantIDs[indexOfRestaurantID]}
          date={today}
        />
      </div>
    );
  }
}
