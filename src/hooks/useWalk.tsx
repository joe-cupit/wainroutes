import { useEffect, useState } from "react";
import { Walk } from "../pages/WalkPage/WalkPage";


export const useWalk = (slug?: string) => {
  const [walkData, setWalkData] = useState<Walk>();
  const [walkLoading, setWalkLoading] = useState(true);

  useEffect(() => {
    if (!slug || slug.length == 0) {
      setWalkData(undefined);
      setWalkLoading(false);
      return;
    }
    setWalkLoading(true);

    fetch('https://data.wainroutes.co.uk/walks/'+slug)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setWalkData(data))
      .catch((err) => {throw new Error(err.message)})
      .finally(() => setWalkLoading(false))
  }, [slug])

  return { walkData, walkLoading };
}