import "./ElevationChart.css"

import React, { useEffect, useMemo } from 'react'
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDistanceUnit, getElevationUnit } from "../utils/unitConversions";


export default function ElevationChart({ data, setActiveIndex, showHillMarkers=false }) {

  const totalDist = useMemo(() => {
    return data ? data[data.length-1].dist : 0
  }, [data])

  const waypoints = useMemo(() => {
    return data ? data.filter(a => a.waypoint) : []
  }, [data])


  return (
    data && 
      <ResponsiveContainer width="100%" height="100%" className="elevation-chart">
        <AreaChart data={data}
          id="elevation-chart"
          margin={{ left: -20, bottom: 18, top: 30, right: 5 }}
          onMouseLeave={() => setActiveIndex(null)}
        >

          <XAxis dataKey="dist" 
            type="number" // unit="km"
            domain={[0, totalDist]}
            // ticks={[0, Number((totalDist/4).toFixed(1)), Number((totalDist/2).toFixed(1)), Number((3*totalDist/4).toFixed(1)), totalDist.toFixed(1)]}
            ticks={[...Array(Math.floor(totalDist)+1).keys()]}
            tickMargin={3}
            label={{value: `Distance (${getDistanceUnit()})`, position: "insideBottom", offset: -15, "fill": "var(--_clr-chart-black)"}}
          />
          <YAxis
            type="number" // unit="m"
            // domain={[0, Math.ceil(Math.max(...data.map(d => d.ele)) / 100) * 100]}
            ticks={[Math.min(...data.map(d => d.ele)), Math.max(...data.map(d => d.ele))]}
            // ticks={[...Array(Math.max(...data.map(d => d.ele))+1).keys()]}
            // ticks={[0, Number((Math.max(...data.map(d => d.ele))+1).toFixed(1)), Number((Math.max(...data.map(d => d.ele))+1).toFixed(1)), Number((Math.max(...data.map(d => d.ele))+1).toFixed(0)), Math.max(...data.map(d => d.ele))]}
            label={{value: `Ele (${getElevationUnit()})`, angle: -90, position: "center", "fill": "var(--_clr-chart-black)"}}
          />

          {showHillMarkers &&
          <>
            <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 0, y: data[0].ele }]} stroke="var(--_clr-chart-black-light)" strokeWidth={1} />
            {waypoints?.map((wp, index) => {
              return <ReferenceLine key={index} segment={[{ x: wp.dist, y: 0 }, { x: wp.dist, y: wp.ele }]} stroke="var(--_clr-chart-black-light)" strokeWidth={1} />
            })}
            <ReferenceLine segment={[{ x: totalDist, y: 0 }, { x: totalDist, y: data[data.length-1].ele }]} stroke="var(--_clr-chart-black-light)" strokeWidth={1} />
          </>
          }

          <Area dataKey="ele"
            isAnimationActive={false}
            dot={showHillMarkers && <CustomWaypointDot />}
            stroke="var(--_clr-chart-stroke)" strokeWidth={3}
            fill="var(--_clr-chart-fill)" // fillOpacity={0.5}
          />

          <Tooltip
            isAnimationActive={false}
            content={<CustomToolTipContent setActiveIndex={setActiveIndex} />}
            cursor={{ stroke: "var(--_clr-chart-black)", strokeWidth: 1.5 }}
          />

          <Area dataKey="ele"
            isAnimationActive={false} dot={false}
            stroke="opaque" fillOpacity={0}
            activeDot={e => <ActiveDot payload={e} setActiveIndex={setActiveIndex} />}
          />

        </AreaChart>
      </ResponsiveContainer>
  )
}


const CustomToolTipContent = ({ payload, setActiveIndex }) => {

  useEffect(() => {
    if (!payload?.length > 0) setActiveIndex(null)
  }, [payload])

  return <></>
}


const ActiveDot = ({ payload, setActiveIndex }) => {

  useEffect(() => {
    setActiveIndex(payload.index)
  }, [])

  const width = 10
  const halfwidth = width / 2

  const svgElement = document.getElementById("elevation-chart")
  const svgWidth = svgElement?.width?.baseVal?.value
  const svgHeight = svgElement?.height?.baseVal?.value

  const atStart = payload.cx < 65
  const atEnd = payload.cx > (svgWidth - 5 - 22)
  const atEndLong = payload.cx > (svgWidth - 65)
  const atBottom = payload.cy + 5 > svgHeight - 55

  return (
    <>
      <text fill="var(--_clr-chart-black)" textAnchor={atStart ? "start" : (atEnd ? "end" : "middle")} x={atStart ? 65-23 : (atEnd ? svgWidth-5 : payload.cx)} y={20} style={{fontSize: "var(--fs-300)", fontWeight: "var(--fw-medium)"}}>{payload?.payload?.dist?.toFixed(1) + getDistanceUnit()}</text>
      <text fill="var(--_clr-chart-black)" textAnchor={atEndLong ? "end" : "start"} x={atEndLong ? payload.cx - 10 : payload.cx + 10} y={atBottom ? svgHeight - 55 : payload.cy + 5} style={{fontSize: "var(--fs-300)", fontWeight: "var(--fw-medium)", textShadow: "white -0.125rem 0, white 0.125rem 0, white 0 -0.125rem, white 0 0.125rem"}}>{payload?.payload?.ele?.toFixed(0) + getElevationUnit()}</text>
      <svg x={payload.cx - halfwidth} y={payload.cy - halfwidth} width={width} height={width} fill="var(--_clr-chart-stroke)" stroke="var(--_clr-chart-black)" viewBox="0 0 24 24" strokeWidth={4}>
        <path d="M2 12A1 1 0 0021 12 2 2 0 002 12Z"/>
      </svg>
    </>
  )
}


const CustomWaypointDot = ({ cx, cy, payload }) => {

  const width = 16
  const halfwidth = width / 2

  if (payload.waypoint?.length > 0) {
    return (
      <svg x={cx - halfwidth} y={cy - width} width={width} height={width} viewBox="0 0 24 24" fill="var(--_clr-chart-stroke)" stroke="var(--_clr-chart-black)" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
    )
  }

  return null
}
