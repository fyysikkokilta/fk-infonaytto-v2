import lightningcss from 'bun-lightningcss'

if (!Bun.env.GOOGLE_CALENDAR_API_KEY) {
  throw new Error("Missing Google Calendar API key")
}
if (!Bun.env.FLICKR_API_KEY) {
  throw new Error("Missing Flickr API key")
}
if (!Bun.env.SPOTIFY_CLIENT_ID) {
  throw new Error("Missing Spotify client ID")
}
if (!Bun.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Missing Spotify client secret")
}
if (!Bun.env.SPOTIFY_REFRESH_TOKEN) {
  throw new Error("Missing Spotify refresh token")
}
if (!Bun.env.WAPPU_DECLARED) {
  throw new Error("Missing Wappu declared")
}

const builds = await Bun.build({
  entrypoints: ['./src/index.tsx'],
  target: "browser",
  define: {
    'Bun.env.GOOGLE_CALENDAR_API_KEY': JSON.stringify(Bun.env.GOOGLE_CALENDAR_API_KEY),
    'Bun.env.FLICKR_API_KEY': JSON.stringify(Bun.env.FLICKR_API_KEY),
    'Bun.env.SPOTIFY_CLIENT_ID': JSON.stringify(Bun.env.SPOTIFY_CLIENT_ID),
    'Bun.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(Bun.env.SPOTIFY_CLIENT_SECRET),
    'Bun.env.SPOTIFY_REFRESH_TOKEN': JSON.stringify(Bun.env.SPOTIFY_REFRESH_TOKEN),
    'Bun.env.WAPPU_DECLARED': JSON.stringify(Bun.env.WAPPU_DECLARED),
  },
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

    if (pathname === "/api/recently-listened" && req.method === "GET") {
      const recentlyListed = await getRecentlyListened()
      return new Response(JSON.stringify(recentlyListed), {
        headers: {
          'Content-Type': 'application/json',
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

async function getRecentlyListened() {
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${Bun.env.SPOTIFY_CLIENT_ID}:${Bun.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=refresh_token&refresh_token=' + Bun.env.SPOTIFY_REFRESH_TOKEN,
  })
  const { access_token } = await tokenResponse.json()
  const data = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
    headers: {
      'Authorization': `Bearer ${access_token}`,
    },
  })
  const recentlyListened = await data.json()

  return recentlyListened.items.map((item: {track: {artists: {name: string}[], name: string, album: {images: {url: string}[]}}, played_at: string}) => ({
    artist: item.track.artists[0].name,
    title: item.track.name,
    timestamp: new Date(item.played_at).getTime(),
    thumbnail: item.track.album.images[0].url,
  }))
}

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
