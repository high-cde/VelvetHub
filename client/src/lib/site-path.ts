export function sitePath(path: string) {
  const clean = path.replace(/^\//, "");
  if (!clean) return import.meta.env.BASE_URL;
  return `${import.meta.env.BASE_URL}${clean.replace(/\/$/, "")}/`;
}
