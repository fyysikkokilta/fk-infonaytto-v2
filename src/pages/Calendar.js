import React from "react";
import axios from "axios";
import styles from "../css/calendar.module.css";
import { apiKeys } from "../apiKeys"

const apiKey = apiKeys['Google calendar']
const maxNumberOfEvents = 4;
const timeStamp = new Date().toISOString().substr(0, 10) + 'T00:00:00-00:00';
const timePerFrame = 7;
const calendars = {
  'ahe0vjbi6j16p25rcftgfou5eg@group.calendar.google.com': 'Tapahtumat',
  'ji339ebgiaauv5nk07g41o65q8@group.calendar.google.com': 'Ura ja opinnot',
  //'guqva296aoq695aqgq68ak7lkc@group.calendar.google.com': 'Kokoukset',
  //'u6eju2k63ond2fs7fqvjbna50c@group.calendar.google.com': 'Fuksit',
  //'0p9orculc8m8ocnfec11mb6ksk@group.calendar.google.com': 'ISOt',
  //'hjhvblcv9n1ue3tf29j3loqqi4@group.calendar.google.com': 'Kulttuuri',
  //'0orqvov2gidl3m24cnsq4ml1ao@group.calendar.google.com': 'Liikunta',
};
const calendarIDs = Object.keys(calendars)

// TODO: maybe something to indicate if event is today

const listEvents = (events, cid) => {
  if (events.hasOwnProperty('items')) {
    return(
      <div className={styles.events}>
        <h1 className={styles.h1}> {calendars[cid]} </h1>
        { events['items'].length === 0
          ? <h3> Ei tapahtumia </h3>
          :
          <div className={styles.text}>
          {events['items'].reverse().map((event, index) =>
            <div key={index}>
              <p>
              { dateOfEvent(event.start) } {'......'} {event.summary}    
              </p>
            </div>
          )}
          </div>
        }
      </div>
    )
  }
  return ''
}

// Formats start date given by google calendar api in a consistent way
const dateOfEvent = start => {
  if (start.hasOwnProperty('date')) {
    return convertYYYYMMDDtoDDMM(start.date)
  } else if (start.hasOwnProperty('dateTime')) {
    return convertYYYYMMDDtoDDMM(start.dateTime.substr(0,10))
  } else {
    return ''
  }
}

// Takes string 'YYYY-MM-DD' and converts it to 'dd.mm'
const convertYYYYMMDDtoDDMM = timestamp => {
  const [yyyy, mm, dd] = timestamp.split('-')
  if (yyyy === new Date().getFullYear())
    return dd+'.'+mm
  return dd+'.'+mm+'.'+yyyy
}


export default class Calendar extends React.Component {
  state = { data: [], index: 0 };

  static timeout = calendarIDs.length*timePerFrame*1000;
  static priority = 3;

  static isActive() {
    return true;
  }

  componentDidMount() {
    calendarIDs.map(cid => {
      axios.get("https://www.googleapis.com/calendar/v3/calendars/" + cid + "/events?key=" + apiKey + "&maxResults=" + maxNumberOfEvents + "&timeMin=" + timeStamp).then(respose => {
        const newData = {
          events: respose.data,
          cid: cid
        }
        this.setState({
          data: this.state.data.concat(newData)
        })
      })
    })
    setInterval(() => {
      this.setState({
        // Can't take modulo zero cause it is NaN
        index: (this.state.index + 1) % (this.state.data.length === 0 ? 1 : this.state.data.length)
      });
    }, 1000*timePerFrame );
  }

  render() {
    return (
      <div className={styles.background}>
        <div className={styles.topBar}></div>
        <div className={styles.overlay}>
          { this.state.data.length === 0 ? '' : listEvents(this.state.data[this.state.index].events, this.state.data[this.state.index].cid) }
        </div>
      </div>
    )
  }
}