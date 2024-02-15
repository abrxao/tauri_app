export default function weightFormat(weight: number) {
  const formattedWeight =
    weight > 1 ? weight.toPrecision(2) : (weight * 1000).toPrecision(3);
  const unit = weight > 1 ? "kg" : "g";
  return `${formattedWeight} ${unit}`;
}
