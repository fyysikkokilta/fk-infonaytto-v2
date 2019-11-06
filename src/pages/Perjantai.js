import React from "react";
import perjantai from "../images/perjantai.mp4";

export default class Page1 extends React.Component {
  static timeout = 6000;
  static priority = 2;

  // TODO add correct active times
  static isActive = () => true;

  // TODO consider showing this upside down, mirrored, as tiled background...
  render() {
    return (
      <div>
        <video
          autoPlay
          loop
          alt="perjantai"
          src={perjantai}
          type="video/mp4"
          width="100%"
        />
      </div>
    );
  }
}
