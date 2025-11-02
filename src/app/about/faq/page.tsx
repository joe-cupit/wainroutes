import { createPageMetadata } from "@/utils/metadata";

import ComingSoon from "@/app/coming-soon";

export function generateMetadata() {
  return createPageMetadata({
    title: "FAQs",
    description: "Coming soon.",
    path: "/about/faq",
  });
}

export default function page() {
  return (
    <ComingSoon description="I'm still working on the FAQ page - if you have any questions feel free to ask away on the contact page!" />
  );
}
