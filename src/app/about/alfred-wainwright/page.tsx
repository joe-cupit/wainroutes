import { createPageMetadata } from "@/utils/metadata";

import ComingSoon from "@/app/coming-soon";


export function generateMetadata() {
  return createPageMetadata({
    title: "Alfred Wainwright",
    description: "Coming soon.",
    path: "/about/alfred-wainwright",
  });
}


export default function page() {
  return (
    <ComingSoon
      description="The page on Alfred Wainwright will be ready soon!"
    />
  )
}
