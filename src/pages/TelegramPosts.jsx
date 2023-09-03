import React, { useState, useEffect } from "react"
import axios from "axios"
import styles from "../css/telegramPost.module.css"

// Same chat names must be telegram-bot/config.py in telegram-bot
const chatUsernames = ["fk_infonaytto", "fklors"]

const Banner = ({ chatName }) => {
  const bannerTexts = {
    fklors: "Fk lörs",
    fk_infonaytto: "Lähetä viestiä! @fk_infonayttobot"
  }
  return <div className={styles.topBar}> {bannerTexts[chatName]} </div>
}

export const TelegramPost = ({ showNext }) => {
  const [tgPost, setTgPost] = useState(null)
  const chatUsername = chatUsernames[Math.floor(Math.random() * chatUsernames.length)]

  useEffect(() => {
    axios.get("/update").then(response => {
      const messageID = response.data[chatUsername]["latest_message_id"]
      const percentage = Math.random() * 0.05 + 0.95
      setTgPost(chatUsername + "/" + Math.floor(messageID*percentage))
    })

    const id = showNext(20000)
    return () => clearTimeout(id)
  }, [chatUsername])

  return (
    <div>
      <Banner chatName={chatUsername} />
      <div id="posts" className={styles.telegramPosts}>
        {tgPost &&
          <script type="text/javascript" async={true} src="https://telegram.org/js/telegram-widget.js?7" data-telegramPost={tgPost} data-width="900px">

          </script>
        }
      </div>
    </div>
  )
}

const exportObject = { priority: 2.5, isActive: () => true, component: TelegramPost }

export default exportObject