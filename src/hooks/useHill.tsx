import { useEffect, useState } from "react";
import { Hill } from "../pages/HillPage";


export const useHill = (slug?: string) => {
  const [hillData, setHillData] = useState<Hill>();
  const [hillLoading, setHillLoading] = useState(true);

  useEffect(() => {
    if (!slug || slug.length == 0) {
      setHillData(undefined);
      setHillLoading(false);
      return;
    }
    setHillLoading(true);

    fetch('https://data.wainroutes.co.uk/hills/'+slug)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setHillData(data))
      .catch((err) => {throw new Error(err.message)})
      .finally(() => setHillLoading(false))
  }, [slug])

  return { hillData, hillLoading };
}