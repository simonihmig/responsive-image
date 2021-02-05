export default function dataUri(
  data: string,
  type: string,
  base64 = false
): string {
  return `data:${type};base64,${base64 ? data : btoa(data)}`;
}
