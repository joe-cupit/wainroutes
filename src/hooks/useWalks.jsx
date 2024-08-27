import { useEffect, useState } from "react"


export const useWalks = (slug) => {
  const [walkData, setWalkData] = useState(null);

  useEffect(() => {
    if (!slug) return;

    fetch("/walks/walkdata.json")
      .then(res => res.json())
      .then(data => {
        setWalkData(data[slug]);
        console.log("got walk data");
      })
  }, [slug]);

  return walkData
}