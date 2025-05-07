import hillDataJson from "../assets/hillData.json";
import { Hill } from "../pages/HillPage";


export const useHills = (slug?: string) => {
  const hillData: {[slug: string]: Hill} = hillDataJson;

  if (slug === null || slug === undefined) return hillData;
  else return hillData[slug];
}