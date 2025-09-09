"use client";

import styles from "@/styles/error.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useEffect } from "react";

import Link from "next/link";
import BackButton from "@/components/BackButton/BackButton";

 
export default function Error({ error }: { error: Error & { digest?: string } }) {

  useEffect(() => {
    document.title = "Internal Server Error | Wainroutes";
    console.error(error);
  }, [error]);


  return (
    <main className={styles.error}>
      <section>
        <div className={styles.simple}>
          <h1 className={`${fontStyles.title} ${styles.message}`}>Something went wrong!</h1>
          <p>There seems to be a problem with the server, if you think this shouldn&apos;t be happening try again and if the problem persists then please <Link href="/contact" className={styles.link}>report a problem</Link>.</p>
          <BackButton />
        </div>
      </section>
    </main>
  );
}