import styles from "./Breadcrumbs.module.css"
import fontStyles from "@/styles/fonts.module.css"

import Link from "next/link"
import { Fragment } from "react"


type BreadcrumbsProps = {
  crumbs: {[name: string]: string}
}


export default function Breadcrumbs({crumbs} : BreadcrumbsProps) {
  return (
    <ol className={`${styles.breadcrumbs} ${fontStyles.subtext}`}>
      {Object.keys(crumbs).map((link, index) => (
        <Fragment key={index}>
          <li>
            <Link href={crumbs[link]}>{link}</Link>
          </li>
          {(index + 1) < Object.keys(crumbs).length && "/"}
        </Fragment>
      ))}
    </ol>
  )
}
