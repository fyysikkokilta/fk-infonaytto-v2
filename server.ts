import { NextFunction, Request, Response } from "express"
import axios from 'axios'
import express from 'express'
import { readFile } from 'fs'

//APP SETUP
const serverPort = 3010
const app = express()
app.listen(serverPort, () => {
  console.log("Server started on port " + serverPort)
})
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(express.static('build'))

app.get("/api/history", (req: Request, res: Response) => {
  readFile('./history.json', 'utf8', (err, data) => {    
    res.set('Content-Type', 'application/json')
    res.send(data)
  })
})

app.get("/api/update", (req: Request, res: Response) => {
  readFile('./update.json', 'utf8', (err, data) => {    
    res.set('Content-Type', 'application/json')
    res.send(data)
  })
})

app.get("/api/open-restaurants", (req: Request, res: Response) => {
  const now = new Date()
  const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
  const todayString = today.toISOString().substring(0,10)
  const restaurantIDs = [1, 5, 3, 45, 50, 51, 52]
  let currentDay = now.getDay()
  currentDay = currentDay === 0 ? 6 : currentDay - 1
  axios.get<{openingHours: string[], id: string}[]>(`https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=${restaurantIDs.join()}&priceCategories=student,studentPremium`)
    .then(response => {
      return response.data.filter(restaurant => {
        const todayOpenings = restaurant.openingHours[currentDay]
        if(!todayOpenings) return false
        const [open, close] = todayOpenings.split("-")
        const [openHour, openMinute] = open.split(":")
        const [closeHour, closeMinute] = close.split(":")
        const openTime = new Date()
        openTime.setHours(Number(openHour), Number(openMinute))
        const closeTime = new Date()
        closeTime.setHours(Number(closeHour), Number(closeMinute))
        return openTime < now && now < closeTime
      }).map(restaurant => restaurant.id)
    }).then(openRestaurants => {
      if(openRestaurants.length === 0) return res.send([])
      axios
        .get(
          `https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants=${openRestaurants}&days=${todayString}`
        )
        .then(response => {
          res.set('Content-Type', 'application/json')
          res.send(Object.entries(response.data)) 
        })
    })
})