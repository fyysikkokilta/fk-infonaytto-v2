import React from "react";
import moment from "moment";
import styles from "../css/wappulaskuri.module.css"

const nextWappu = moment(`${moment().year()}-05-01 00:00:00`);

if (nextWappu < moment()) {
  nextWappu.add(1, 'year')
}

class Counter extends React.Component {
  render() {
    return (
      <div className={[styles.display, styles.score].join(' ')}>
        <h2 className={styles.number}>{this.props.timeUnit}</h2>
        <br />
        <span className={styles.text}>{this.props.text}</span>
      </div>
    )
  }
}

export default class Wappulaskuri extends React.Component {
  state = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  };

  static timeout = 20000;
  static priority = 2;

  // TODO some clever activity and priority function
  static isActive() {
    return true;
  }

  componentDidMount() {
    setInterval(() => {
      const difference = nextWappu.diff(moment(), "seconds")

      this.setState({ days: Math.floor(difference / (24 * 60 * 60)) });
      this.setState({ hours: Math.floor(difference % (24 * 60 * 60) / (60 * 60)) });
      this.setState({ minutes: Math.floor(difference % (24 * 60 * 60) % (60 * 60) / 60) });
      this.setState({ seconds: difference % (24 * 60 * 60) % (60 * 60) % 60 });
    }, 1000);
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.cover}></div>
        <h1 className={styles.title}>Aikaa wappuun</h1>
        <div className={styles.row}>
          <Counter timeUnit={this.state.days} text={"Päivää"}/>
          <Counter timeUnit={this.state.hours} text={"Tuntia"}/>
          <Counter timeUnit={this.state.minutes} text={"Minuttia"}/>
          <Counter timeUnit={this.state.seconds} text={"Sekuntia"}/>
        </div>
      </div>
    );
  }
}
