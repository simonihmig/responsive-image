const configNamespaces = new Map();

export function getConfig<C extends object = Record<string, unknown>>(
  namespace: string,
): C | undefined {
  return configNamespaces.get(namespace) as C | undefined;
}

export function setConfig<C extends object = Record<string, unknown>>(
  namespace: string,
  config: C,
): void {
  configNamespaces.set(namespace, config);
}
