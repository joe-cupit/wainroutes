import { ReactNode } from "react";
import { HillsProvider } from "./HillsContext";
import { WalksProvider } from "./WalksContext";
import { WeatherProvider } from "./WeatherContext";


export default function ContextProvider({ children } : { children: ReactNode }) {
  return (
    <WalksProvider>
    <HillsProvider>
    <WeatherProvider>
      {children}
    </WeatherProvider>
    </HillsProvider>
    </WalksProvider>
  )
}
