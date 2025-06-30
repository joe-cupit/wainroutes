import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Walk } from "../pages/WalkPage/WalkPage";


type WalksContextType = {
  walks: Walk[] | undefined;
  loading: boolean;
  error: Error | null
}

const WalksContext = createContext<WalksContextType | undefined>(undefined);


export const useWalks = () => {
  const context = useContext(WalksContext);
  if (!context) throw new Error('useWalks must be used in WalksProvider');
  return context;
}

export const useWalk = (slug?: string) => {
  const { walks, loading } = useWalks();
  return { walkData: walks?.find(w => w.slug == slug), walkLoading: loading }
}


export const WalksProvider = ({ children } : { children : ReactNode }) => {

  const [walks, setWalks] = useState<Walk[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('https://data.wainroutes.co.uk/walks.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setWalks(data))
      .catch((err) => {
        console.error("Error fetching walks");
        setError(err);
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <WalksContext.Provider value={{ walks, loading, error }}>
      {children}
    </WalksContext.Provider>
  )
}
