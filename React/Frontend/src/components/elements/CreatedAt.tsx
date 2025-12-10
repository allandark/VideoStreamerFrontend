export function CreatedAt({ value }: { value: string }) {
  // "2025-12-04 08:17:44" -> "2025-12-04T08:17:44Z"
  if (value == null) return <div></div>;
  const iso = value.replace(" ", "T") + "Z";
  const date = new Date(iso);

  const formatted = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return <time dateTime={date.toISOString()}>{formatted}</time>;
}
