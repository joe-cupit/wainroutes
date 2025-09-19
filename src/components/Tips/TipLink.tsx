import styles from "./Tip.module.css"
import { ReactNode } from "react"


export default function TipLink({ children } : { children: ReactNode}) {
  return (
    <a
      href="https://ko-fi.com/wainroutes"
      target="_blank"
      className={styles.link}
    >
      {children}
    </a>
  )
}
