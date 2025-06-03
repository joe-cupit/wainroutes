import { useEffect, useState } from "react";
import { Hill } from "../pages/HillPage";


export const useHills = () => {
  const [hillsData, setHillsData] = useState<Hill[]>();
  useEffect(() => {
    fetch('https://data.wainroutes.co.uk/hills')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setHillsData(data))
      .catch((err) => {throw new Error(err.message)})
  }, [])

  return hillsData;
}


export const useHill = (slug?: string) => {
  const [hillData, setHillData] = useState<Hill>();
  useEffect(() => {
    if (!slug || slug.length == 0) return;

    fetch('https://data.wainroutes.co.uk/hills/'+slug)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setHillData(data))
      .catch((err) => {throw new Error(err.message)})
  }, [slug])

  return hillData;
}