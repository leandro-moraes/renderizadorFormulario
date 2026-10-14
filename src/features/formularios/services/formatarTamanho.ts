export function formatarTamanho(bytes: number): string {
  const mb = bytes / (1024 * 1024);

  return `${Number.isInteger(mb) ? mb : mb.toFixed(2)} MB`;
}