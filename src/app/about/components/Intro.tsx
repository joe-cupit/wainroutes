import styles from "../About.module.css";
import fontStyles from "@/styles/fonts.module.css";

export default function Intro() {
  return (
    <section className={styles.introSection}>
      <div className={styles.intro}>
        <h2 className={fontStyles.heading}>
          A Guide to the Lake District&apos;s Wainwrights
        </h2>
        <p>
          From detailed routes and maps to mountain weather forecasts and
          photos, Wainroutes is designed to make planning walks in the Lake
          District easier and more enjoyable, whether you&apos;re aiming for all
          214 Wainwrights or just heading out for a day in the fells.
        </p>
      </div>
    </section>
  );
}
