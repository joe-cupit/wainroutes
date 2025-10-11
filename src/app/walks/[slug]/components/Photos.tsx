import styles from "../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import ImageGallery from "./ImageGallery";
import { WalkGallery } from "@/types/Walk";

export default function Photos({
  slug,
  galleryData,
}: {
  slug: string;
  galleryData: WalkGallery | undefined;
}) {
  if (!galleryData) return <></>;

  if (slug) {
  }

  return (
    <div id="walk-photos">
      <h2 className={fontStyles.subheading} id={styles.photos}>
        Photos
      </h2>

      <ImageGallery
        imageList={galleryData?.imageIds?.map((img) => slug + "_" + img)}
        imageData={galleryData?.imageData}
        groups={galleryData?.sections}
      />
    </div>
  );
}
