import { ReactNode } from "react";
import { HillsProvider } from "./HillsContext";
import { WalksProvider } from "./WalksContext";


export default function ContextProvider({ children } : { children: ReactNode }) {
  return (
    <WalksProvider>
    <HillsProvider>
      {children}
    </HillsProvider>
    </WalksProvider>
  )
}
