import React from "react";
import axios from "axios";

const imageStyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '90vh',
  'transform': 'translateY(5%)',   // Vertical align for image
};

export default class Inspirobot extends React.Component {
  state = { imageURL: "" };

  static timeout = 20000;
  static priority = 3;

  static isActive() {
    return true;
  }

  // Invoced when component is added to DOM. Calls Inspirobot's api to get image src
  componentDidMount() {
    axios.get("https://inspirobot.me/api?generate=true").then(respose => {
      this.setState({ imageURL: respose.data });
    });
  }

  render() {
    return (
      <div>
        <img
          src={this.state.imageURL}
          style={imageStyle}
          alt="Motivational quote"
        />
      </div>
    );
  }
}
