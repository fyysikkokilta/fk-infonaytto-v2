import React, { useEffect } from "react"
import axios from "axios"
import styles from "../css/telegramPost.module.css"
import { PageProps } from "../types"

// Same chat names must be telegram-bot/config.py in telegram-bot
const chatUsernames = ["fk_infonaytto", "fklors"]

type ChatUserName = keyof typeof bannerTexts

const bannerTexts = {
  fklors: "Fk lörs",
  fk_infonaytto: "Lähetä viestiä! @fk_infonayttobot"
}

const Banner = ({ chatName }: { chatName: ChatUserName }) => {
  return <div className={styles.topBar}> {bannerTexts[chatName]} </div>
}

type Response = Record<ChatUserName, {latest_message_id: number, date: number, title: string, chat_id: number, username: string}>

export const TelegramPost = ({ showNext }: PageProps) => {
  const chatUsername = chatUsernames[Math.floor(Math.random() * chatUsernames.length)] as ChatUserName

  useEffect(() => {
    axios.get<Response>("/api/update").then(response => {
      const messageID = response.data[chatUsername]["latest_message_id"]
      const percentage = Math.random() * 0.05 + 0.95
      const tgpost = chatUsername + "/" + Math.floor(messageID*percentage)
      const s = document.createElement("script")
      s.type = "text/javascript"
      s.async = true
      s.src = "https://telegram.org/js/telegram-widget.js?7"
      s.dataset.telegramPost = tgpost
      s.dataset.width = "900px"
      document.getElementById("posts")?.appendChild(s)
    })

    showNext(20000)
  }, [])

  return (
    <div>
      <Banner chatName={chatUsername} />
      <div id="posts" className={styles.telegramPosts} />
    </div>
  )
}

const exportObject = { priority: 2.5, isActive: () => true, component: TelegramPost }

export default exportObject
