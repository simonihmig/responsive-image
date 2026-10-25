import {
  getClassNames,
  getHeight,
  getSources,
  getSourcesSorted,
  getSrc,
  getStyles as getLqipStyles,
  getWidth,
  type ImageData,
  type ResponsiveImageArgs,
} from '@responsive-image/core';
import * as Solid from 'solid-js';

import './responsive-image.css';

export type { ResponsiveImageArgs } from '@responsive-image/core';

const isServer = typeof window === 'undefined';

const responsiveImageArgs = new Set<string>([
  'class',
  'src',
  'size',
  'sizes',
  'width',
  'height',
] satisfies Array<keyof ResponsiveImageArgs | 'class'>);

export type ResponsiveImageProps = ResponsiveImageArgs & {
  class?: string;
  [key: string]: unknown;
};

// `style` accepts a string or an object of (hyphenated) CSS properties. Typed
// structurally so the source compiles against both Solid v1 and v2 typings
// (v1 exposes `JSX.CSSProperties`, v2 moved the JSX namespace to @solidjs/web).
type StyleValue = string | Record<string, string | number | undefined>;

// compat: Solid v1 exposes `onMount`, v2 renamed it to `onSettled`.
type HookName = 'onMount' | 'onSettled';
type MountHook = (typeof Solid)[Extract<keyof typeof Solid, HookName>];
const hooks: Partial<Record<HookName, MountHook>> = Solid;
const onMountCompat = (hooks.onSettled ?? hooks.onMount)!;

export const ResponsiveImage: Solid.Component<ResponsiveImageProps> = (
  props,
) => {
  const [loadedSrc, setLoaded] = Solid.createSignal<ImageData | undefined>(
    undefined,
  );
  const attributes = () => {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(props)) {
      if (
        key !== 'style' && // Skip style because we merge them in styles()
        !responsiveImageArgs.has(key)
      ) {
        result[key] = props[key];
      }
    }
    return result;
  };
  const isLoaded = () => loadedSrc() === props.src;

  const width = () => getWidth(props);

  const height = () => getHeight(props);

  const src = () => getSrc(props);

  const sources = () => getSources(props);

  const sourcesSorted = () => getSourcesSorted(sources());

  const classNames = () => getClassNames(props, isLoaded(), props.class);

  // LQIP styles take precedence over user-provided styles while loading, and
  // are merged so unrelated user styles (e.g. border-radius) are preserved.
  const styles = (): StyleValue | undefined => {
    const lqipStyles =
      isLoaded() || isServer ? undefined : getLqipStyles(props, isLoaded());
    const userStyles = props['style'];

    if (typeof userStyles === 'string') {
      const lqipString = lqipStyles
        ? Object.entries(lqipStyles)
            .filter(([, value]) => value !== undefined)
            .map(([property, value]) => `${property}: ${value}`)
            .join('; ')
        : '';

      return [userStyles, lqipString].filter(Boolean).join('; ') || undefined;
    }

    const merged: Record<string, string | number | undefined> = {
      ...(userStyles as
        | Record<string, string | number | undefined>
        | undefined),
      ...lqipStyles,
    };

    return Object.keys(merged).length > 0 ? merged : undefined;
  };

  // check if src is already loaded (SSR) and update state so LQIP options are removed
  let imgEl: HTMLImageElement | undefined;

  onMountCompat(() => {
    if (imgEl?.complete) {
      setLoaded(props.src);
    }
  });

  const renderImg = () => (
    // When LQIP is used, the key is our src, so when src changes, the img element is recreated to re-apply LQIP styles without having
    // the previous src visible (<img> is a stateful element!). Without LQIP, reuse existing DOM.
    // See also https://github.com/simonihmig/responsive-image/issues/1583#issuecomment-3315142391
    <Solid.Show
      when={props.src}
      keyed={Solid.untrack(() => !!props.src?.lqip) as false}
    >
      <img
        width={width()}
        height={height()}
        class={classNames()}
        loading="lazy"
        decoding="async"
        srcset={
          props.src?.imageTypes === 'auto'
            ? // auto format assumes only one entry in sources
              sources()[0]?.srcset
            : undefined
        }
        src={src()}
        {...attributes()}
        data-ri-lqip={props.src?.lqip?.attribute}
        style={styles()}
        ref={(el: HTMLImageElement) => {
          imgEl = el;
        }}
        onLoad={() => setLoaded(props.src)}
      />
    </Solid.Show>
  );

  return (
    <Solid.Show
      when={props.src && props.src.imageTypes !== 'auto'}
      fallback={renderImg()}
    >
      <picture>
        {sourcesSorted().map((s) => (
          <source srcset={s.srcset} type={s.mimeType} sizes={s.sizes} />
        ))}
        {renderImg()}
      </picture>
    </Solid.Show>
  );
};
