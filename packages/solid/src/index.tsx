import { Accessor, Component, createComputed, createSignal } from 'solid-js'

export function createHello(): [Accessor<string>, (to: string) => void] {
  const [hello, setHello] = createSignal('Hello World!')

  return [hello, (to: string) => setHello(`Hello ${to}!`)]
}

export const Hello: Component<{ to?: string }> = props => {
  const [hello, setHello] = createHello()

  // Console calls will be removed in production if `dropConsole` is enabled

  // eslint-disable-next-line no-console
  console.log('Hello World!')

  createComputed(() => {
    if (typeof props.to === 'string') setHello(props.to)
  })

  return (
    <>
      <div>{hello()}</div>
    </>
  )
}
