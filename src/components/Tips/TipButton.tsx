import styles from "./Tip.module.css"


export default function TipButton() {

  return (
    <a
      href="https://ko-fi.com/wainroutes"
      target="_blank"
      className={styles.button}
    >
      <img
        src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com" />
    </a>
  )
}
