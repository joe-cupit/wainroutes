export default function roundToNearestInt(value: number, multiple: number = 1) {
  return Math.round(value / multiple) * multiple;
}
