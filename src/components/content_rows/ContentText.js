import React from 'react'
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

const Bold = ({ children }) => <strong>{children}</strong>
const Text = ({ children }) => <p>{children}</p>
const Blockquote = ({ children }) => <blockquote>{children}</blockquote>

const parseAsset = (node) => {
  return (
    <span>
      id: {node.data.target.sys.id}
    </span>
  )
}

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
  },
  renderNode: {
    [BLOCKS.QUOTE]: (node, children) => <Blockquote>{children}</Blockquote>,
  },
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => <figure>{parseAsset(node)}</figure>,
  },
}

export const format = (json) => {
  let parsedJSON = JSON.parse(json)
  // console.log('parsedJSON:', parsedJSON)
  return documentToReactComponents(parsedJSON, options)
}

const ContentText = ({ data }) => {
  return <div>{ format(data.text.text) }</div>
}

export default ContentText;

export const ContentTextFragement = graphql`
  fragment ContentTextFragement on ContentfulContentText {
    id
    title
    text {
      text
    }
  }
`
