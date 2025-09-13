import styles from "./Contact.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import BigImageHero from "@/components/BigImageHero/BigImageHero";
import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";


export function generateMetadata() {
  return createPageMetadata({
    title: "Get in Touch",
    description: "Contact Wainroutes.",
    path: "/contact",
    imageURL: "/images/contact.JPEG",
  });
}


export default async function Contact() {

  return (
    <main className={styles.page}>
      <BigImageHero
        title="Get in Touch"
        src="/images/contact.JPEG"
        alt="A gang of curious sheep on a mountainside"
      />

      <section>
        <div className={styles.intro}>
          <h2 className={fontStyles.heading}>Contact me</h2>
          <p>If you'd like to get in touch, I'd love to hear from you. Whether it's a question about one of the routes, feedback on the sire, or to share your own walking experience in the Lakes, feel free to drop me a message.</p>
        </div>
      </section>

      <PageLinkGrid
        title="Useful Resources"
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
            title: "Other Resources",
            description: "Something else.",
            href: "#",
            imageSrc: "/images/about-4.JPEG",
            imageAlt: "A gang of curious sheep on a mountainside"
          },
        ]}
      />

    </main>
  )
}