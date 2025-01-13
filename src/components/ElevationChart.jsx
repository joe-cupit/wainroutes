import React, { useMemo } from 'react'
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function ElevationChart({ data, setActiveIndex }) {

  const totalDist = useMemo(() => {
    return data ? data[data.length-1].dist : 0
  }, [data])

  const waypoints = useMemo(() => {
    return data ? data.filter(a => a.waypoint) : []
  }, [data])

  console.log([...Array(Math.floor(totalDist)).keys()])


  return (
    data && 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 20 }}
          onMouseLeave={() => setActiveIndex(null)}
        >

          <XAxis dataKey="dist" 
            type="number" unit="km"
            domain={[0, totalDist]}
            ticks={[0, Number((totalDist/4).toFixed(1)), Number((totalDist/2).toFixed(1)), Number((3*totalDist/4).toFixed(1)), totalDist.toFixed(1)]}
            // ticks={[...Array(Math.floor(totalDist)+1).keys()]}
            // interval={1}
            tickMargin={5}
          />
          <YAxis type="number" unit="m"
            axisLine={false} orientation="right"
            ticks={[Math.min(...data.map(d => d.ele)), Math.max(...data.map(d => d.ele))]}
          />

          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 0, y: data[0].ele }]} />
          {waypoints?.map(wp => {
            return <ReferenceLine segment={[{ x: wp.dist, y: 0 }, { x: wp.dist, y: wp.ele }]} />
          })}
          <ReferenceLine segment={[{ x: totalDist, y: 0 }, { x: totalDist, y: data[data.length-1].ele }]} />

          <Tooltip position={{ y: 25 }} 
            isAnimationActive={false}
            content={<CustomToolTipContent setActiveIndex={setActiveIndex} />}
          />

          <Line dataKey="ele" unit="m"
            isAnimationActive={false}
            // dot={false}
            dot={<CustomWaypointDot />}
            activeDot={e => <ActiveDot payload={e} setActiveIndex={setActiveIndex} />}
            stroke="var(--clr-primary-400)" strokeWidth={3}
          />


        </LineChart>
      </ResponsiveContainer>
  )
}


const ActiveDot = ({ payload, setActiveIndex }) => {
  console.log(payload)

  setActiveIndex(payload.index)

  const width = 10
  const halfwidth = width / 2

  return (
    <svg x={payload.cx - halfwidth} y={payload.cy - halfwidth} width={width} height={width} fill="var(--clr-primary-500)" stroke="var(--clr-white-400)" viewBox="0 0 24 24" strokeWidth={5}>
      <path d="M1 12A1 1 0 0023 12 1 1 0 001 12Z"/>
    </svg>
  )
}


const CustomToolTipContent = ({ active, payload, label, setActiveIndex }) => {

  if (active && payload && payload.length) {
    return (
      <div className="elevation-chart_tooltip">
        <p>Distance: {label.toFixed(1) + "km"}</p>
        <p>Elevation: {payload[0]?.payload?.ele + "m"}</p>
      </div>
    );
  }
  else {
    setActiveIndex(null)
    return null;
  }
}


const CustomWaypointDot = ({ cx, cy, payload }) => {

  const width = 22
  const halfwidth = width / 2

  if (payload.waypoint?.length > 0) {
    return (
      <svg x={cx - halfwidth} y={cy - halfwidth} width={width} height={width} fill="var(--clr-black-500)" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.298 14H8.714c-.547 0-.82 0-.958-.111a.5.5 0 0 1-.185-.397c.003-.177.179-.387.53-.806l3.308-3.95c.212-.253.318-.38.444-.425a.5.5 0 0 1 .344 0c.126.047.231.174.442.428l3.275 3.95c.346.419.52.628.522.804a.5.5 0 0 1-.186.396c-.137.111-.41.111-.952.111Z" />
      </svg>
    )
  }

  return null
}
