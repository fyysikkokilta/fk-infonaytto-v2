import React, { useEffect } from 'react'
import styles from '../css/telegramPost.module.css'
import { PageProps } from '../types'

// Same chat names must be telegram-bot/config.py in telegram-bot
const chatUsernames = ['fkinfonaytto', 'fklors']

type ChatUserName = keyof typeof bannerTexts

const bannerTexts = {
  fklors: 'Fk lörs',
  fkinfonaytto: 'Lähetä viestiä! @fk_infonaytto_bot'
}

const Banner = ({ chatName }: { chatName: ChatUserName }) => {
  return <div className={styles.topBar}> {bannerTexts[chatName]} </div>
}

type Response = Record<
  ChatUserName,
  {
    latest_message_id: number
    date: number
    title: string
    chat_id: number
    username: string
  }
>

export const TelegramPost = ({ showNext }: PageProps) => {
  const chatUsername = chatUsernames[
    Math.floor(Math.random() * chatUsernames.length)
  ] as ChatUserName

  useEffect(() => {
    fetch('/api/update').then(async (response) => {
      const responseJson = (await response.json()) as Response
      const latestMessageID = responseJson[chatUsername]['latest_message_id']
      const messageToChoose = Math.floor(Math.random() * 100)
      const tgpost =
        chatUsername + '/' + Math.max(latestMessageID - messageToChoose, 0)
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = 'https://telegram.org/js/telegram-widget.js?7'
      s.dataset.telegramPost = tgpost
      s.dataset.width = '900px'
      document.getElementById('posts')?.appendChild(s)
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

const exportObject = {
  name: 'TelegramPosts',
  priority: 2.5,
  isActive: () => true,
  component: TelegramPost
}

export default exportObject
