import React from "react";
import styles from "../css/spotify.module.css";
import ColorThief from "colorthief";
import axios from "axios";

// NOTE this component requires browser extension that allows cross origin requests in order to work properly.
// For example https://addons.mozilla.org/fi/firefox/addon/cors-everywhere/ for firefox.
// Also script must be set to Guild rooms computer that updates history.json file.

class Table extends React.Component {
  render() {
    return (
      <div className={styles.text}>
        <h1 id="h1" className={styles.h1}>Kiltiksellä soi</h1>
        <table id="table" className={styles.table}>
          <tbody>
            {this.props.spotifyHistory.map((item, index) => {
              const timeMinutes =
                (Date.now() / 1000 - parseInt(item.timestamp)) / 60;
              const [time, timeUnit] =
                timeMinutes > 60
                  ? [Math.floor(timeMinutes / 60), "h"]
                  : [Math.floor(timeMinutes), "min"];
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
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

class BackgroundImage extends React.Component {
  render() {
    return (
      <img
        id="albumCover"
        crossOrigin={"anonymous"}
        src={this.props.imageURL}
        className={styles.img}
        alt={"Album cover"}
        onLoad={() => {
          // When image has loaded, use colorthief to extract colors from image and set page colors accordingly.
          const colorThief = new ColorThief();
          const img = document.getElementById("albumCover");
          const colors = colorThief.getPalette(img, 2);

          const r1 = colors[0][0];
          const g1 = colors[0][1];
          const b1 = colors[0][2];
          const r2 = colors[1][0];
          const g2 = colors[1][1];
          const b2 = colors[1][2];

          document.getElementById("h1").style.color = `rgb(${r2},${g2}, ${b2})`;
          document.getElementById("table").style.color = `rgb(${r2},${g2}, ${b2})`;
          document.getElementById("mask").style.background = `rgba(${r1},${g1}, ${b1}, 0.87)`;
        }}
      />
    );
  }
}

export default class Spotify extends React.Component {
  state = {
    spotifyHistory: [],
    imageURL: ""
  };

  static timeout = 10000;
  static priority = 3;

  static isActive() {
    return true;
  }

  componentDidMount() {
    // From public folder one can read file this way.
    axios.get("history.json").then(respose => {
      this.setState({ spotifyHistory: respose.data });
      this.setState({ imageURL: this.state.spotifyHistory[0].thumbnail });
    });
  }

  render() {
    return (
      <div>
        <BackgroundImage imageURL={this.state.imageURL} />
        <div id="mask" className={styles.mask}></div>
        <Table spotifyHistory={this.state.spotifyHistory} />
      </div>
    );
  }
}
