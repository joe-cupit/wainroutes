import styles from "../Footer.module.css";
import fonts from "@/styles/fonts.module.css";

import Link from "next/link";

type LinkListProps = {
  heading: string;
  links: { [name: string]: string };
};

export default function LinkList({ heading, links }: LinkListProps) {
  return (
    <div className={styles.links}>
      <h2 className={fonts.smallheading}>{heading}</h2>
      <ul>
        {Object.entries(links).map(([name, link], index) => (
          <li key={index}>
            <Link href={link}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
