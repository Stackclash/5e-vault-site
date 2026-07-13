const LOCATION_TYPE_LABELS: Record<string, string> = {
  World: "World",
  Region: "Region",
  Settlement: "Settlement",
  PointOfInterest: "Point of Interest",
  Shop: "Shop",
};

export function locationTypeLabel(type: string): string {
  return LOCATION_TYPE_LABELS[type] ?? "Location";
}
