import styles from "./Contact.module.css";
import fontStyles from "@/styles/fonts.module.css";

import Image from "next/image";
import { createPageMetadata } from "@/utils/metadata";

import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";


export function generateMetadata() {
  return createPageMetadata({
    title: "Get in Touch",
    description: "Get in touch with Joe at Wainroutes. Share feedback, questions, or route suggestions for this Lake District walking resource.",
    path: "/contact",
    imageURL: "/images/contact.JPEG",
  });
}


export default async function Contact() {

  return (
    <main className={styles.page}>
      <section>
        <div className={styles.hero}>
          <Image
            src="/images/contact.JPEG"
            fill={true}
            sizes="(max-width: 35rem): 150vw, 100vw"
            alt="A gang of curious sheep on a mountainside"
          />
        </div>
      </section>

      <section>
        <div className={styles.intro}>
          <h1 className={fontStyles.heading}>Get in Touch</h1>
          <p>Wainroutes is designed to be a useful resource for anyone exploring the Lakes, so if you&apos;ve got feedback or ideas, I&apos;d love to hear from you.</p>
          <p>You can email me at <a href="mailto:joe@wainroutes.co.uk">joe@wainroutes.co.uk</a>, and I&apos;ll get back to you as soon as I can.</p>
        </div>
      </section>

      <PageLinkGrid
        title="Quick Links"
        pages={[
          {
            title: "About Wainroutes",
            description: "Find out more about the site and what's available.",
            href: "/about",
            imageSrc: "/images/terrain.jpg",
            imageAlt: ""
          },
          {
            title: "FAQs",
            description: "Frequently asked questions.",
            href: "/about/faq",
            imageSrc: "/images/about-1.JPEG",
            imageAlt: ""
          },
          {
            title: "Safety in the Lakes",
            description: "Learn more about staying safe in the mountains in all weather conditions.",
            href: "/safety",
            imageSrc: "/images/safety-1.JPEG",
            imageAlt: "A climber scrambling the final section of Striding Edge"
          },
        ]}
      />

    </main>
  )
}