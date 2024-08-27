import { useMemo, useEffect, useState } from "react"
import { useHills } from "../hooks/useHills";


export const useHillMarkers = (filters=null) => {
  const hillData = useHills(null);

  const hillMarkers = useMemo(() => hillData 
    ? Object.values(hillData).map(hill => ({
        coordinates: [hill.latitude, hill.longitude],
        properties: {
          type: "hill",
          book: hill.book
        }
      }))
    : []
  , [hillData]);

  return hillMarkers
}


export const useWalkMarkers = (filters=null) => {

  const [walkData, setWalkData] = useState([]);

  useEffect(() => {
    fetch("/walks/walkstarts.json")
      .then(res => res.json())
      .then(data => {
        setWalkData(data.map(walk => ({
          coordinates: [walk.latitude, walk.longitude],
          properties: {
            type: "walk"
          }
        })));
        console.log("got walk starts");
      })
  }, [])

  return walkData
}
