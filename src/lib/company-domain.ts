const SECOND_LEVEL_SUFFIXES = new Set(["co", "com", "org", "net", "ac"]);

export function companyFromEmail(email: string) {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  const parts = domain.split(".").filter(Boolean);
  const raw =
    parts.length >= 3 && SECOND_LEVEL_SUFFIXES.has(parts.at(-2) ?? "")
      ? parts.at(-3)
      : parts.at(-2) ?? parts[0] ?? "";

  return (raw ?? "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
