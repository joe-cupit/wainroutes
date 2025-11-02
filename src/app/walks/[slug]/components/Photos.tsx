import styles from "../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import ImageGallery from "./ImageGallery";
import Walk from "@/types/Walk";

export default function Photos({
  slug,
  images,
}: {
  slug: string;
  images: Walk["images"];
}) {
  if (!images) return <></>;

  return (
    <div id="walk-photos">
      <h2 className={fontStyles.subheading} id={styles.photos}>
        Photos
      </h2>

      <ImageGallery slug={slug} images={images} />
    </div>
  );
}
