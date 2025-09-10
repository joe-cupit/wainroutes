import styles from "./Tip.module.css"


export default function TipWidget() {
  return (
    <iframe
      id="kofiframe"
      src="https://ko-fi.com/wainroutes/?hidefeed=true&widget=true&embed=true&preview=true"
      className={styles.widget}
    />
  )
}
