import React, { useEffect } from "react"
import { PageProps } from "../types"

const iframeStyle = {
  'position': 'fixed' as 'fixed',
  'top': 0,
  'left': 0,
  'bottom': 0,
  'right': 0,
  'width': '100%',
  'height': '100%',
  'border': 'none',
  'margin': 0,
  'padding': 0,
}

// TODO move these functions to another place, maybe rename? (under_score vs camelCase)
const weighted_idx = (weights: number[]) => {
  /*
   * Given a list of weights [w0, w1, ...],
   * return the index i with weighted probability wi.
   * The weights don't need to sum to 1, they are just relative weights.
   */
  var cum_w: number[] = [] // cumulative weights
  // total weight is returned at the end of reduce
  var total_w = weights.reduce(function(prev, next, i) { return cum_w[i] = prev + next }, 0)
  var r = Math.random() * total_w
  return cum_w.findIndex((w) => { return w > r })
}

type Pair = [string, number]

const weighted_choice = (pairs: Pair[], return_index = false) => {
  /*
   * Given a list of pairs [[a0, w0], [a1, w1], ...],
   * randomly select an element ai with probability weighted by wi.
   * The weights don't need to sum to 1, they are just relative weights.
   */
  var weights = pairs.map((x) => { return x[1] })
  var i = weighted_idx(weights)
  if(return_index) {
    return i
  } else {
    return pairs[i][0]
  }
}

const titlesWeighted = [
  ["Lähtevät bussit", 1],
  ["lörs", 0.2],
  ["bussningkörsnings", 0.2],
  ["TÄNÄÄN lähtee", 0.5],
  ["π = 3", 0.2],
  ["Otani", 0.2],
  ["Körsbärsvägen", 0.2],
  ["mee töihi", 0.5],
  ["Bussi kulkee vaan", 0.5],
  ["new Bus(True, False)", 0.2],
  ["Joskus on hyvä poistua", 0.7],
  ["Poistu", 0.2],
  ["Ota takkisi ja poistu", 0.2],
  ["Jos ei oo varaa taksiin", 0.1],
  ["aik ata ulu", 0.05],
  ["vastalääkettä otaantumiseen", 0.2],
  ["Entä jos vaikka menisit kotiin :)", 0.2],
  ["kun käytät joukkoliikennettä", 0.1],
  ["On meillä hauska setä, nyt bussikuskina... 🎵", 0.05],
  ["On meillä hauska täti, nyt bussikuskina... 🎵", 0.05],
  ["On meillä hauska täti, nyt metrokuskina... 🎵", 0.05],
  ["On meillä hauska setä, nyt metrokuskina... 🎵", 0.05],
  ["🚌 🚌  🚌   🚌     🚌          🚌  ", 0.02],
  ["Pakkaa veitsesi ja poistu", 0.03]
] as Pair[]

export const HSLtimetable = ({ showNext }: PageProps) => {

  useEffect(() => {
    showNext(20000)
  }, [])
  
  return (
    <div>
      <iframe title="timetable" src={`http://hsl.trapeze.fi/traveller/web?command=fullscreen&id=FyyKiOK&cols=1&extracolumn=platform&offset=240&title=${weighted_choice(titlesWeighted)}`} style={iframeStyle}></iframe>
    </div>
  )}

const exportObject = { name: 'HSLtimetable', priority: 2, isActive: () => true, component: HSLtimetable }

export default exportObject
