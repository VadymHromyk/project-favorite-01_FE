export default function formatUserName(name?: string | null): string {
  if (!name) return "Імʼя";
  return name.length > 14 ? `${name.slice(0, 11)}...` : name;
}
