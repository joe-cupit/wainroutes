import { useEffect, useState } from "react"


export const useHills = () => {
  const [hillData, setHillData] = useState(null);

  useEffect(() => {
    fetch("/mountains/wainwrights.json")
      .then(res => res.json())
      .then(data => {
        setHillData(data);
        console.log("got wainwright data");
      })
  }, []);

  return hillData
}