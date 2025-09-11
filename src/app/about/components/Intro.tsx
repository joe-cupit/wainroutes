import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";


export default function Intro() {
  return (
    <section className={styles.introSection}>
      <div className={styles.intro}>
        {/* <h1 className={fontStyles.title}>About Wainroutes</h1> */}
        {/* <b>Wainroutes is your go to site for all things Lake District and climbing Wainwrights.</b> */}
        <h2 className={fontStyles.heading}>A Walker's Guide to the Wainwrights</h2>
        {/* <p>Follow along as I walk the Wainwrights, sharing routes, advice and inspiration along the way.</p> */}
        <p>Wainroutes started as the resource I wish I'd had when I began walking the Wainwrights. With routes, weather, and useful info all in one place.</p>
      </div>
    </section>
  )
}
