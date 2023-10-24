import lightningcss from 'bun-lightningcss'

const builds = await Bun.build({
  entrypoints: ['./src/index.tsx'],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
  outdir: './build',
  plugins: [lightningcss()],
})

const indexFile = Bun.file('public/index.html')

const server = Bun.serve({
  port: 3010,
  fetch: async (req, server) => {
    const { pathname } = new URL(req.url)

    if (pathname === "/main.js" && req.method === "GET") {
      return new Response(builds.outputs[0].stream(), {
        headers: {
          'Content-Type': builds.outputs[0].type,
        },
      })
    }

    if (pathname === "/favicon.ico" && req.method === "GET") {
      const faviconFile = Bun.file('public/favicon.ico')
      return new Response(faviconFile.stream(), {
        headers: {
          'Content-Type': faviconFile.type,
        },
      })
    }

    if (pathname.includes("images")) {
      const imageFile = Bun.file(`src${pathname}`)
      return new Response(imageFile.stream(), {
        headers: {
          'Content-Type': imageFile.type,
        },
      })
    }

    if (pathname.includes("fonts")) {
      const fontFile = Bun.file(`src${pathname}`)
      return new Response(fontFile.stream(), {
        headers: {
          'Content-Type': fontFile.type,
        },
      })
    }

    if (pathname === "/api/update" && req.method === "GET") {
      const updateFile = Bun.file('update.json')
      return new Response(updateFile.stream(), {
        headers: {
          'Content-Type': updateFile.type,
        },
      })
    }

    if (pathname === "/api/history" && req.method === "GET") {
      const historyFile = Bun.file('history.json')
      return new Response(historyFile.stream(), {
        headers: {
          'Content-Type': historyFile.type,
        },
      })
    }

    if (pathname === "/api/open-restaurants" && req.method === "GET") {
      const openRestaurants = await getOpenRestaurants()
      return new Response(JSON.stringify(openRestaurants), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    if (pathname === "/" && req.method === "GET") {
      const indexContent = await indexFile.text()

      const contentWithReactScript = indexContent.replace(
        "<!-- react-script -->",
        `<script type="module" src="/main.js"></script>`,
      )

      return new Response(contentWithReactScript, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`Listening on ${server.hostname}:${server.port}`)

async function getOpenRestaurants() {
  const date = new Date()
  const timeNow = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
  const todayString = timeNow.toISOString().substring(0,10)
  const restaurantIDs = [1, 5, 3, 45, 50, 51, 52]
  let currentDay = timeNow.getDay()
  currentDay = currentDay === 0 ? 6 : currentDay - 1
  const data = await fetch(`https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=${restaurantIDs.join()}&priceCategories=student,studentPremium`)
  const restaurants = await data.json() as {openingHours: string[], id: string}[]
  const openRestaurants = restaurants.filter(restaurant => {
    const todayOpenings = restaurant.openingHours[currentDay]
    if(!todayOpenings) return false
    const [open, close] = todayOpenings.split("-")
    const [openHour, openMinute] = open.split(":")
    const [closeHour, closeMinute] = close.split(":")
    const openTime = new Date(timeNow.getTime())
    openTime.setUTCHours(Number(openHour), Number(openMinute), 0, 0)
    const closeTime = new Date(timeNow.getTime())
    closeTime.setUTCHours(Number(closeHour), Number(closeMinute), 0, 0)
    return openTime < timeNow && timeNow < closeTime
  }).map(restaurant => restaurant.id)

  if(openRestaurants.length === 0) return []
  const menus = await fetch(`https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants=${openRestaurants}&days=${todayString}`)
  return Object.entries(await menus.json())
}
