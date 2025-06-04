import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Hill } from "../pages/HillPage";


type HillsContextType = {
  hills: Hill[] | undefined;
  loading: boolean;
  error: Error | null
}

const HillsContext = createContext<HillsContextType | undefined>(undefined);


export const useHills = () => {
  const context = useContext(HillsContext);
  if (!context) throw new Error('useHills must be used in HillsProvider');
  return context;
}

export const useHill = (slug?: string) => {
  const { hills, loading } = useHills();
  return { hillData: hills?.find(h => h.slug == slug), hillLoading: loading }
}


export const HillsProvider = ({ children } : { children : ReactNode}) => {

  const [hills, setHills] = useState<Hill[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('https://data.wainroutes.co.uk/hills.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setHills(data))
      .catch((err) => {
        console.error("Error fetching hills");
        setError(err);
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <HillsContext.Provider value={{ hills, loading, error }}>
      {children}
    </HillsContext.Provider>
  )
}
