import styles from "./Breadcrumbs.module.css"
import fontStyles from "@/app/fonts.module.css"

import Link from "next/link"
import { Fragment } from "react"


type BreadcrumbsProps = {
  crumbs: {[name: string]: string}
}


export default function Breadcrumbs({crumbs} : BreadcrumbsProps) {
  return (
    <div className={`${styles.breadcrumbs} ${fontStyles.subtext}`}>
      {Object.keys(crumbs).map((link, index) => (
        <Fragment key={index}>
          <Link href={crumbs[link]}>{link}</Link>
          {(index + 1) < Object.keys(crumbs).length && "/"}
        </Fragment>
      ))}
    </div>
  )
}
