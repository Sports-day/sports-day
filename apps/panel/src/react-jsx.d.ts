// react-markdown v8 uses global JSX namespace which was removed in @types/react 19
// This shim re-exports React.JSX as global JSX for compatibility
import type { JSX as ReactJSX } from 'react'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
    interface Element extends ReactJSX.Element {}
  }
}
