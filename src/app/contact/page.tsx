import styles from "./Contact.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import BigImageHero from "@/components/BigImageHero/BigImageHero";
import PageLinkGrid from "@/components/PageLinkGrid/PageLinkGrid";

export function generateMetadata() {
  return createPageMetadata({
    title: "Get in Touch",
    description:
      "Get in touch with Joe at Wainroutes. Share feedback, questions, or route suggestions for this Lake District walking resource.",
    path: "/contact",
    imageURL:
      "https://images.wainroutes.co.uk/contact/curious-sheep-on-a-lake-district-mountainside-thumb_1024w.webp",
  });
}

export default async function Contact() {
  return (
    <main className={styles.page}>
      <BigImageHero
        title="Get in Touch"
        src="contact/curious-sheep-on-a-lake-district-mountainside.webp"
        srcSmall="contact/curious-sheep-on-a-lake-district-mountainside-mobile.webp"
        alt="Derwentwater"
      />

      <section>
        <div className={styles.intro}>
          <h2 className={fontStyles.heading}>Get in Touch</h2>
          <p>
            Wainroutes is designed to be a useful resource for anyone exploring
            the Lakes, so if you&apos;ve got feedback or ideas, I&apos;d love to
            hear from you.
          </p>
          <p>
            You can email me at{" "}
            <a href="mailto:joe@wainroutes.co.uk">joe@wainroutes.co.uk</a>, and
            I&apos;ll get back to you as soon as I can.
          </p>
        </div>
      </section>

      <PageLinkGrid
        title="Quick Links"
        pages={[
          {
            title: "About Wainroutes",
            description: "Find out more about the site and what's available.",
            href: "/about",
            imageSrc: "about/walking-the-dog-on-derwentwater-at-sunset.webp",
            imageAlt: "",
          },
          {
            title: "FAQs",
            description: "Frequently asked questions.",
            href: "/about/faq",
            imageSrc:
              "contact/a-young-lake-district-highland-cow-in-a-field.webp",
            imageAlt: "",
          },
          {
            title: "Safety in the Lakes",
            description:
              "Learn more about staying safe in the mountains in all weather conditions.",
            href: "/safety",
            imageSrc:
              "safety/walker-scrambling-the-final-section-of-striding-edge-thumb.webp",
            imageAlt: "A climber scrambling the final section of Striding Edge",
          },
        ]}
      />
    </main>
  );
}
