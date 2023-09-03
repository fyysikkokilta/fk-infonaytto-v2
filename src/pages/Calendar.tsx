import React, { useState, useEffect } from "react"
import axios from "axios"
import styles from "../css/calendar.module.css"
import { apiKeys } from "../apiKeys"
import { PageProps } from "../types"

// Parameters for api call
const apiKey = apiKeys['Google calendar'] || ''
const maxNumberOfEvents = 4
const timeStamp = new Date().toISOString().substr(0, 10)+'T00:00:00-00:00'

const timePerFrame = 7
const calendars = {
  'ahe0vjbi6j16p25rcftgfou5eg@group.calendar.google.com': 'Tapahtumat',
  'ji339ebgiaauv5nk07g41o65q8@group.calendar.google.com': 'Ura ja opinnot',
  'u6eju2k63ond2fs7fqvjbna50c@group.calendar.google.com': 'Fuksit',
  //'guqva296aoq695aqgq68ak7lkc@group.calendar.google.com': 'Kokoukset',
  //'0p9orculc8m8ocnfec11mb6ksk@group.calendar.google.com': 'ISOt',
  //'hjhvblcv9n1ue3tf29j3loqqi4@group.calendar.google.com': 'Kulttuuri',
  //'0orqvov2gidl3m24cnsq4ml1ao@group.calendar.google.com': 'Liikunta',
}
const calendarIDs = Object.keys(calendars) as (keyof typeof calendars)[]

type CalendarData = {
  cid: keyof typeof calendars
  events: {
    items: {
      summary: string
      start: { date: string, dateTime: string }
    }[]
  }
}

// Lists events or indicates there are no events
const listEvents = (events: CalendarData['events'], cid: CalendarData['cid']) => {
  if (events?.items) {
    return (
      <div className={styles.events}>
        <h1 className={styles.h1}> {calendars[cid]} </h1>
        { events['items'].length === 0
          ? <h3> Ei tapahtumia </h3>
          :
          <div className={styles.text}>
          {events['items'].map((event, index) => {
            return (
              <div key={index}>
                <p> {`${dateOfEvent(event.start)} ...... ${event.summary}`} </p>
              </div>
            )}
          )}
          </div>
        }
      </div>
    )
  }
  return ''
}

// Formats start date given by google calendar api in a consistent way
const dateOfEvent = (start: {date: string, dateTime: string}) => {
  const today = `${new Date().getDate()}.${new Date().getMonth()+1}`
  let ret = ''

  if (start?.date) {
    ret += convertYYYYMMDDtoDDMM(start.date)
  } else if (start?.dateTime) {
    ret +=convertYYYYMMDDtoDDMM(start.dateTime.substr(0,10))
  }

  return ret === today ? `${ret} (TÄNÄÄN)` : ret
}

// Takes string 'YYYY-MM-DD' and converts it to 'DD.MM'
const convertYYYYMMDDtoDDMM = (timestamp: string) => {
  const [yyyy, mm, dd] = timestamp.split('-')

  if (yyyy === `${new Date().getFullYear()}`)
    return `${dd}.${mm}`
  return `${dd}.${mm}.${yyyy}`
}

const Calendar = ({ showNext }: PageProps) => {
  const [data, setData] = useState<CalendarData[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    calendarIDs.forEach(cid => {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${cid}/events?key=${apiKey}&timeMin=${timeStamp}&singleEvents=true&orderBy=startTime&maxResults=${maxNumberOfEvents}` 
      console.log(url)
      axios.get<{items: { summary: string; start: { date: string, dateTime: string } }[]}>(url).then(response => {
        const newData = {
          events: response.data,
          cid: cid
        }
        setData(currentData => currentData.concat(newData))
      })
    })
    const id = setInterval(() => {
      setIndex(
        // Loop over calendars. Can't take modulo zero cause it is NaN
        (index + 1) % (data.length === 0 ? 1 : data.length)
      )
    }, 1000*timePerFrame )
    const id2 = showNext(calendarIDs.length*timePerFrame*1000)
    return () => {
      clearInterval(id)
      clearTimeout(id2)
    }
  }, [])

  return (
    <div className={styles.background}>
      <div className={styles.topBar}></div>
      <div className={styles.overlay}>
        {data.length === 0
          ? ""
          : listEvents(
              data[index].events,
              data[index].cid
            )}
      </div>
    </div>
  )
}

const exportObject = { priority: 3, isActive: () => true, component: Calendar }

export default exportObject
