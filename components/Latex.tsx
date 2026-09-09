import 'katex/dist/katex.min.css'

import katex from 'katex'

export function Latex({
  body,
  displayMode = false,
}: {
  body: string
  displayMode?: boolean
}) {
  const html = katex.renderToString(body, {
    displayMode,
    throwOnError: false,
    trust: false,
    output: 'htmlAndMathml',
  })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
