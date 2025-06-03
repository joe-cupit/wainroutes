import { useEffect, useState } from "react";
import { Walk } from "../pages/WalkPage/WalkPage";


export const useWalks = () => {
  const [walksData, setWalksData] = useState<Walk[]>();
  useEffect(() => {
    fetch('https://data.wainroutes.co.uk/walks')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setWalksData(data))
      .catch((err) => {throw new Error(err.message)})
  }, [])

  return walksData;
}


export const useWalk = (slug?: string) => {
  const [walkData, setWalkData] = useState<Walk>();
  useEffect(() => {
    if (!slug || slug.length == 0) return;

    fetch('https://data.wainroutes.co.uk/walks/'+slug)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setWalkData(data))
      .catch((err) => {throw new Error(err.message)})
  }, [slug])

  return walkData;
}