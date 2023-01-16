import React from "react";
import axios from "axios";
import styles from "../css/telegramPost.module.css";

// Same chat names must be telegram-bot/config.py in telegram-bot
const chatUsernames = ["fk_infonaytto", "fklors"];

const Banner = ({ chatName }) => {
  const bannerTexts = {
    fklors: "Fk lörs",
    fk_infonaytto: "Lähetä viestiä! @fk_infonayttobot"
  };
  return <div className={styles.topBar}> {bannerTexts[chatName]} </div>;
};

export default class TelegramPost extends React.Component {
  state = {
    // Must be here to select chat randomly.
    chatUsername: chatUsernames[Math.floor(Math.random() * chatUsernames.length)]
  }

  static timeout = 20000;
  static priority = 2.5;

  static isActive() {
    return true;
  }


  componentDidMount() {
    axios.get("/update").then(respose => {
      const messageID = respose.data[this.state.chatUsername]["latest_message_id"];
      const tgpost = this.state.chatUsername + "/" + messageID;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://telegram.org/js/telegram-widget.js?7";
      s.dataset.telegramPost = tgpost;
      s.dataset.width = "900px";
      document.getElementById("posts").appendChild(s);
    });
  }

  render() {
    return (
      <div>
        <Banner chatName={this.state.chatUsername} />
        <div id="posts" className={styles.telegramPosts}></div>
      </div>
    );
  }
}
