export default function generateSrcSet(path: string, ext: string, maxWidth?: number) {
  const imgWidths = ["256", "512", "1024", "2048"];
  return imgWidths
          .filter(w => (maxWidth === undefined || Number(w) <= maxWidth))
          .map(w => `${path}_${w}w${ext} ${w}w`).join(", ");
}