export default function generateSrcSet(path: string, maxWidth?: number) {
  const lastIndex = path.lastIndexOf(".");
  const name = path.substring(0, lastIndex);
  const ext = path.substring(lastIndex);

  const imgWidths = ["256", "512", "1024", "2048"];
  return imgWidths
          .filter(w => (maxWidth === undefined || Number(w) <= maxWidth))
          .map(w => `${name}_${w}w${ext} ${w}w`).join(", ");
}