import React, { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function ElevationChart({ data }) {

  console.log(data)
  const totalDist = useMemo(() => {
    return data ? data[data.length-1].dist : null
  }, [data])


  return (
    data && 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 25 }}>

          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip position={{ y: 25}} isAnimationActive={false} />

          <XAxis dataKey="dist" unit="km"
            ticks={[0, Number((totalDist/4).toFixed(1)), Number((totalDist/2).toFixed(1)), Number((3*totalDist/4).toFixed(1)), totalDist]}
          />
          <YAxis unit="m"
            axisLine={false} orientation="right"
            ticks={[Math.min(...data.map(d => d.ele)), Math.max(...data.map(d => d.ele))]}
          />

          <Line dataKey="ele" unit="m"
            dot={false} label={false}
            stroke="var(--clr-primary-400)" strokeWidth={2}
          />

        </LineChart>
      </ResponsiveContainer>
  )
}
