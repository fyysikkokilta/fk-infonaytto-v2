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

const listDishes = (menu, date) => {
  if (!menu) {
    return <p>Ei aukiolevia ravintoloita</p>;
  }

  if (menu[1]?.hasOwnProperty(date)) {
    return (
      <div>
        {menu[1][date].map((dish, index) =>
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

const Menu = ({ menu, date }) => {
  return (
    <div className={styles.mask}>
      {menu && <h1 className={styles.h1}> {restaurants[menu[0]]} </h1>}
      <div className={styles.text}>{listDishes(menu, date)}</div>
    </div>
  );
};

export default class Ruokalista extends React.Component {
  state = {
    menu: [],
    indexOfRestaurantID: 0
  };

  static timeout = restaurantIDs.length * timePerFrame * 1000;
  static priority = 3;

  static isActive() {
    return restaurants.length !== 0;
  }

  componentDidMount() {
    axios.get('open-restaurants').then(response => {
      this.setState({ menu: response.data });
      setInterval(() => {
        this.setState({
          indexOfRestaurantID: (this.state.indexOfRestaurantID + 1) % response.data.length
        });
      }, timePerFrame * 1000);
    })
  }

  render() {
    const { menu, indexOfRestaurantID } = this.state;

    return (
      <div className={styles.background}>
        <Menu
          menu={menu?.[indexOfRestaurantID]}
          date={today}
        />
      </div>
    );
  }
}
